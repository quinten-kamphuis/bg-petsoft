"use server"

import {  signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db"
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypyt from 'bcryptjs'
import { checkAuth } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";
import { AuthError } from "next-auth";

export const logIn = async (prevState: unknown, formData: unknown) => {
  if (formData instanceof FormData === false) {
    return {
      message: "Invalid form data",
    };
  }
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid email or password",
          };
        }
        case "CallbackRouteError": {
          return {
            message: "Invalid email or password",
          };
        }
        default: {
          return {
            message: "Could not sign in",
          };
        }
      }
    }
    throw error; // nextjs redirect throws error, we need to rethrow it
  }
}

export const signOutAction = async () => {
  await signOut({
    redirectTo: "/"
  });
}

export const signUp = async (prevState: unknown, formData: unknown) => {
  if (formData instanceof FormData === false) {
    return {
      message: "Invalid form data",
    };
  }
  const formDataEntries = Object.fromEntries(formData.entries());

  const credentials = authSchema.safeParse(formDataEntries);
  if (!credentials.success) {
    return {
      message: "Invalid form data",
    };
  }
  const { email, password } = credentials.data;
  const hashedPassword = await bcrypyt.hash(password, 10)
  try {
    await prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return {
        message: "Email already in use",
      };
    }
    return {
      message: "Could not sign up",
    };
  }
  revalidatePath("/login", 'layout');
}

export const addPet = async (pet: unknown) => {
  const session = await checkAuth();
  
  try{
    const parsedPet = petFormSchema.parse(pet);
    await prisma.pet.create({
      data: {
        ...parsedPet,
        user: {
          connect: {
            id: session.user.id,
          }
        }
      },
    });
  } catch (error) {
    return {
      message: "Could not add pet",
    };
  }
  revalidatePath("/app", 'layout');
}

export const editPet = async (pet: unknown, id: unknown) => {
  const parsedId = petIdSchema.safeParse(id);
  const session = await checkAuth();
  const matchingPet = await prisma.pet.findUnique({
    where: {
      id: parsedId.data,
    },
    select: {
      userId: true,
    },
  });
  if (!matchingPet || matchingPet.userId !== session.user!.id) {
    return {
      message: "Could not delete pet",
    };
  }

  try {
    const parsedPet = petFormSchema.parse(pet);
    const parsedId = petIdSchema.parse(id);
    await prisma.pet.update({
      where: {
        id: parsedId,
      },
      data: parsedPet,
    });
  } catch (error) {
    return {
      message: "Could not edit pet",
    };
  }
  revalidatePath("/app", 'layout');
}

export const deletePet = async (id: unknown) => {
  const session = await checkAuth();
  const parsedId = petIdSchema.safeParse(id);

  const matchingPet = await prisma.pet.findUnique({
    where: {
      id: parsedId.data,
    },
    select: {
      userId: true,
    },
  });
  if (!matchingPet || matchingPet.userId !== session.user!.id) {
    return {
      message: "Could not delete pet",
    };
  }

  try {    
    const parsedId = petIdSchema.parse(id);
    await prisma.pet.delete({
      where: {
        id: parsedId,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet",
    };
  }
  revalidatePath("/app", 'layout');
}

const stripe = require('stripe')(process.env.STRIPE_SECRET);

export const createPaymentSession = async () => {
  const session = await checkAuth();
  const paymentSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    line_items: [
      {
        price: "price_1Ph8BsC6W7ziJv1AMNBpawP0",
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/payment?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/payment?canceled=true`,
  });
  redirect(paymentSession.url);
}
