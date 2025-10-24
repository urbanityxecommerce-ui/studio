
'use client';

import * as React from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, doc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Shield, Search, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: 'free' | 'starter' | 'pro';
}

const searchFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

export default function AdminClient() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [searchedUser, setSearchedUser] = React.useState<AppUser | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);

  const ADMIN_UID = "iAZH63A65dQrJg4pXOrsyn9ZXwH2";
  const isAdmin = user?.uid === ADMIN_UID;

  const searchForm = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: { email: "" },
  });

  React.useEffect(() => {
    if (!isUserLoading && !isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'You do not have permission to view this page.',
      });
      router.push('/');
    }
  }, [isUserLoading, isAdmin, router, toast]);

  const handleSearch = async (data: SearchFormValues) => {
    if (!firestore) return;
    setIsSearching(true);
    setSearchedUser(null);
    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where("email", "==", data.email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast({
          variant: "destructive",
          title: "User Not Found",
          description: `No user found with the email: ${data.email}`,
        });
      } else {
        const userDoc = querySnapshot.docs[0];
        setSearchedUser({ id: userDoc.id, ...userDoc.data() } as AppUser);
      }
    } catch (error) {
      console.error("Error searching user:", error);
      toast({
        variant: "destructive",
        title: 'Search Failed',
        description: 'An error occurred while searching for the user.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlanChange = async (userId: string, newPlan: 'free' | 'starter' | 'pro') => {
    if (!firestore) return;
    try {
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, { plan: newPlan });
      if (searchedUser) {
        setSearchedUser({ ...searchedUser, plan: newPlan });
      }
      toast({
        title: 'Plan Updated',
        description: `User's plan has been changed to ${newPlan}.`,
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update the user plan. Please try again.',
      });
    }
  };

  if (isUserLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center rounded-lg border p-12">
        <Shield className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">Manage users and their subscription plans by searching for their email.</p>
      </header>

       <Card>
        <Form {...searchForm}>
          <form onSubmit={searchForm.handleSubmit(handleSearch)}>
            <CardHeader>
              <CardTitle>Search User</CardTitle>
              <CardDescription>Enter a user's email address to find their profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={searchForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>The searched user will appear below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSearching ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      <div className="flex justify-center items-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    </TableCell>
                  </TableRow>
              ) : searchedUser ? (
                  <TableRow key={searchedUser.id}>
                    <TableCell className="font-medium">
                      {searchedUser.firstName} {searchedUser.lastName}
                    </TableCell>
                    <TableCell>{searchedUser.email}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={searchedUser.plan || 'free'}
                        onValueChange={(value: 'free' | 'starter' | 'pro') => handlePlanChange(searchedUser.id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ) : (
                 <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No user searched yet.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
