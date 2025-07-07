'use client';

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut, Plane, Calendar, MapPin } from "lucide-react";
import { useUserBookings, useCancelBooking } from "@/hooks/useBookings";
import { toast } from "sonner";
import { useApiMutation } from '@/hooks/useApiMutation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { data: bookings, isLoading: bookingsLoading } = useUserBookings();
  const cancelBooking = useCancelBooking();
  const changePasswordMutation = useApiMutation();
  const editProfileMutation = useApiMutation();

  // Modal state for change password
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Modal state for edit profile
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: (user as any)?.phone || '',
    address: (user as any)?.address || '',
    city: (user as any)?.city || '',
    country: (user as any)?.country || '',
    postalCode: (user as any)?.postalCode || '',
  });
  const [profileError, setProfileError] = useState('');

  // Handler for change password
  const handleChangePassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError('');
    if (!currentPassword || !newPassword) {
      setFormError('Both fields are required');
      return;
    }
    if (newPassword.length < 8) {
      setFormError('New password must be at least 8 characters');
      return;
    }
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '';
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken') || '';
    changePasswordMutation.mutate({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`,
      method: 'POST',
      data: { currentPassword, newPassword },
      token: accessToken,
      refreshToken,
    }, {
      onSuccess: () => {
        toast.success('Password changed successfully');
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
      },
      onError: (error: any) => {
        setFormError(error?.message || 'Failed to change password');
      },
    });
  };

  // Handler for edit profile
  const handleEditProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfileError('');
    if (!profileForm.firstName || !profileForm.lastName || !profileForm.phone) {
      setProfileError('First name, last name, and phone are required');
      return;
    }
    const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '';
    const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken') || '';
    editProfileMutation.mutate({
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`,
      method: 'PUT',
      data: profileForm,
      token: accessToken,
      refreshToken,
    }, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
        setShowEditProfile(false);
      },
      onError: (error: any) => {
        setProfileError(error?.message || 'Failed to update profile');
      },
    });
  };

  // Update form fields on open
  const openEditProfile = () => {
    setProfileForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: (user as any)?.phone || '',
      address: (user as any)?.address || '',
      city: (user as any)?.city || '',
      country: (user as any)?.country || '',
      postalCode: (user as any)?.postalCode || '',
    });
    setProfileError('');
    setShowEditProfile(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-gray-600 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user?.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={openEditProfile}>
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowChangePassword(true)}>
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Notification Settings
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full justify-start"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking History</CardTitle>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading bookings...</p>
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Plane className="h-5 w-5 text-blue-600" />
                            <span className="font-semibold">{booking.bookingReference}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${booking.totalPrice}</p>
                            <p className="text-sm text-gray-600">{booking.passengers.length} passengers</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Booked: {new Date(booking.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Class: {booking.cabinClass}</span>
                          </div>
                        </div>
                        
                        {booking.status !== 'CANCELLED' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                await cancelBooking.mutateAsync(booking.id);
                                toast.success('Booking cancelled successfully');
                              } catch (error) {
                                toast.error('Failed to cancel booking');
                              }
                            }}
                            disabled={cancelBooking.isPending}
                          >
                            {cancelBooking.isPending ? 'Cancelling...' : 'Cancel Booking'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">
                    No bookings found. Start by searching for flights!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
              autoFocus
            />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              disabled={changePasswordMutation.isPending}
            />
            {formError && <div className="text-red-500 text-sm">{formError}</div>}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowChangePassword(false)}
                disabled={changePasswordMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProfile} className="space-y-4">
            <Input
              placeholder="First Name"
              value={profileForm.firstName}
              onChange={e => setProfileForm(f => ({ ...f, firstName: e.target.value }))}
              disabled={editProfileMutation.isPending}
              autoFocus
            />
            <Input
              placeholder="Last Name"
              value={profileForm.lastName}
              onChange={e => setProfileForm(f => ({ ...f, lastName: e.target.value }))}
              disabled={editProfileMutation.isPending}
            />
            <Input
              placeholder="Phone"
              value={profileForm.phone}
              onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
              disabled={editProfileMutation.isPending}
            />
            <Input
              placeholder="Address"
              value={profileForm.address}
              onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))}
              disabled={editProfileMutation.isPending}
            />
            <Input
              placeholder="City"
              value={profileForm.city}
              onChange={e => setProfileForm(f => ({ ...f, city: e.target.value }))}
              disabled={editProfileMutation.isPending}
            />
            <Input
              placeholder="Country"
              value={profileForm.country}
              onChange={e => setProfileForm(f => ({ ...f, country: e.target.value }))}
              disabled={editProfileMutation.isPending}
            />
            <Input
              placeholder="Postal Code"
              value={profileForm.postalCode}
              onChange={e => setProfileForm(f => ({ ...f, postalCode: e.target.value }))}
              disabled={editProfileMutation.isPending}
            />
            {profileError && <div className="text-red-500 text-sm">{profileError}</div>}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditProfile(false)}
                disabled={editProfileMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editProfileMutation.isPending}
              >
                {editProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
} 