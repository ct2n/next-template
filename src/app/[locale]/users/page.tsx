"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// shadcn/ui components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useFetch } from "@/hooks/use-fetch";
import { useMutation } from "@/hooks/use-mutation";
import {
  type CreateUserInput,
  createUser,
  userKeys,
} from "@/services/user-service";
import type { User } from "@/types/user";

export default function TestPage() {
  const t = useTranslations("UsersPage");

  // State for error simulation
  const [simulateError, setSimulateError] = useState(false);
  const [customDelay, setCustomDelay] = useState(1000);

  // Build URL with query params for simulation
  const getUsersUrl = `${userKeys.all()}?error=${simulateError}&delay=${customDelay}`;

  // Fetch users using useFetch hook
  const {
    data: users,
    isLoading: isLoadingUsers,
    error: usersError,
    mutate: refetchUsers,
  } = useFetch<User[]>(getUsersUrl);

  // Create user mutation
  const {
    mutate: createUserMutation,
    isLoading: isCreating,
    error: createError,
  } = useMutation<User, CreateUserInput>(userKeys.create(), createUser);

  // Form state for creating user
  const [formData, setFormData] = useState<CreateUserInput>({
    email: "",
    username: "",
    fullName: "",
    role: "user",
  });

  // Created user result
  const [createdUser, setCreatedUser] = useState<User | null>(null);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatedUser(null);

    const result = await createUserMutation(formData);
    if (result) {
      setCreatedUser(result);
      // Reset form
      setFormData({
        email: "",
        username: "",
        fullName: "",
        role: "user",
      });
      // Refetch users list
      refetchUsers();
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p>{t("description")}</p>
        </header>

        <Separator className="my-8" />

        {/* Simulation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t("simulationControls")}
            </CardTitle>
            <CardDescription>{t("simulationDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="simulate-error"
                  checked={simulateError}
                  onCheckedChange={(checked) =>
                    setSimulateError(checked as boolean)
                  }
                />
                <Label
                  htmlFor="simulate-error"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("simulateError")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="delay" className="text-sm font-medium">
                  {t("delayLabel")}
                </Label>
                <Input
                  id="delay"
                  type="number"
                  value={customDelay}
                  onChange={(e) => setCustomDelay(Number(e.target.value))}
                  className="w-24"
                  min={0}
                  step={500}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GET Users Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {t("getUsers")}
                </CardTitle>
                <CardDescription>{t("getUsersDescription")}</CardDescription>
              </div>
              <Button
                onClick={() => refetchUsers()}
                disabled={isLoadingUsers}
                variant="outline"
              >
                {isLoadingUsers ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    {t("loading")}
                  </>
                ) : (
                  t("refresh")
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Loading State */}
            {isLoadingUsers && (
              <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
                <Spinner className="h-5 w-5" />
                <span className="text-muted-foreground">
                  {t("loadingData")}
                </span>
              </div>
            )}

            {/* Error State */}
            {!isLoadingUsers && usersError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {usersError.message}
                  {usersError.errorCode && (
                    <span className="mt-1 block">
                      Code: {usersError.errorCode}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Success State */}
            {users && !isLoadingUsers && (
              <div className="space-y-3">
                <p className="text-muted-foreground text-sm">
                  {t("userCount", { count: users.length })}
                </p>
                <div className="grid gap-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="border-border bg-card flex items-center gap-4 rounded-lg border p-4"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback>
                          {user.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-muted-foreground text-sm">
                          @{user.username} • {user.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "default"
                              : user.role === "moderator"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                        <Badge
                          variant={
                            user.status === "active" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* POST User Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {t("postUsers")}
            </CardTitle>
            <CardDescription>{t("postUsersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">{t("username")}</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="johndoe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("fullName")}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">{t("role")}</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        role: value as CreateUserInput["role"],
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isCreating}
                className="w-full"
                size="lg"
              >
                {isCreating && <Spinner className="mr-2 h-4 w-4" />}
                {isCreating ? t("creating") : t("createUser")}
              </Button>
            </form>

            {/* Create Error */}
            {createError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {createError.message}
                  {createError.errorCode && (
                    <span className="mt-1 block">
                      Code: {createError.errorCode}
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Create Success */}
            {createdUser && (
              <Alert className="mt-4">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  User created successfully!
                  <pre className="bg-muted mt-2 overflow-x-auto rounded p-3 text-xs">
                    {JSON.stringify(createdUser, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Debug Info */}
        <Alert className="bg-muted/50 mt-4">
          <AlertTitle className="text-sm font-bold">Debug Info</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">GET URL:</span>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  {getUsersUrl}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">API Base:</span>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  {process.env.NEXT_PUBLIC_API_URL ||
                    "(not set - using default)"}
                </code>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
