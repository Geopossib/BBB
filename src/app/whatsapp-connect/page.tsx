'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppConnectPage() {
  const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/YourGroupInviteCode"; // Replace with your actual WhatsApp group invite link

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-20rem)]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 p-4 rounded-full w-fit mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#25D366"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </div>
          <CardTitle className="text-2xl font-headline">Join via WhatsApp</CardTitle>
          <CardDescription>
            You're one step away from joining the live voice meeting. Click the button below to connect with our WhatsApp group.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="w-full bg-[#25D366] text-white hover:bg-[#1EAE54]">
            <a href={WHATSAPP_GROUP_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-5 w-5" />
              Connect to WhatsApp
            </a>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            You will be redirected to WhatsApp. Make sure you have it installed on your device.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
