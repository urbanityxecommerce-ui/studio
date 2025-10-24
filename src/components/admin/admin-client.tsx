
'use client';

import * as React from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Shield } from 'lucide-react';

interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  plan: 'free' | 'starter' | 'pro';
}

export default function AdminClient() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isAdmin = user?.uid === process.env.NEXT_PUBLIC_ADMIN_UID;

  const usersQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<AppUser>(usersQuery);

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

  const handlePlanChange = async (userId: string, newPlan: 'free' | 'starter' | 'pro') => {
    try {
      const userDocRef = doc(firestore, 'users', userId);
      await updateDoc(userDocRef, { plan: newPlan });
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
        <p className="text-muted-foreground">Manage users and their subscription plans.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>A list of all registered users in the application.</CardDescription>
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
              {usersLoading &&
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              {!usersLoading &&
                users?.map((appUser) => (
                  <TableRow key={appUser.id}>
                    <TableCell className="font-medium">
                      {appUser.firstName} {appUser.lastName}
                    </TableCell>
                    <TableCell>{appUser.email}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={appUser.plan || 'free'}
                        onValueChange={(value: 'free' | 'starter' | 'pro') => handlePlanChange(appUser.id, value)}
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
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
