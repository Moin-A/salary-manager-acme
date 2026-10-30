"use client";

import { useEffect, useLayoutEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Field, Flex, Heading, IconButton, Input, InputGroup, Stack, Text, chakra } from "@chakra-ui/react";
import { LuBuilding2, LuEye, LuEyeOff } from "react-icons/lu";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  // With Cache Components, Next hides this page instead of unmounting it after
  // sign-in, so its state would still be here (spinner on, password filled in)
  // when the user logs out. The cleanup runs when the page is hidden.
  useLayoutEffect(() => {
    return () => {
      setLoginName("");
      setPassword("");
      setShowPassword(false);
      setError(null);
      setSubmitting(false);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(loginName, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <Flex minH="100vh" w="full" bg="white">
      <Flex
        display={{ base: "none", md: "flex" }}
        direction="column"
        w="45%"
        p="10"
        color="white"
        bgGradient="to-b"
        gradientFrom="#1e3a5f"
        gradientVia="#2c5282"
        gradientTo="#0f1e33"
      >
        <Flex align="center" gap="2">
          <LuBuilding2 size={20} />
          <Text fontWeight="semibold">Salary Management</Text>
        </Flex>

        <Stack gap="4" mt="16" maxW="sm">
          <Heading size="2xl" fontWeight="semibold" lineHeight="short">
            Manage salaries.
            <br />
            Keep everything in sync.
          </Heading>
          <Text color="whiteAlpha.800">
            Track employee details, manage salaries, view reports and maintain an audit trail, all in one place.
          </Text>
        </Stack>
      </Flex>

      <Flex flex="1" align="center" justify="center" p="6">
        <chakra.form onSubmit={handleSubmit} w="full" maxW="sm">
          <Stack gap="6">
            <Stack gap="1">
              <Heading size="xl">Welcome back</Heading>
              <Text color="fg.muted">Sign in to your HR account</Text>
            </Stack>

            <Field.Root required>
              <Field.Label>Login</Field.Label>
              <Input
                name="login"
                autoComplete="username"
                placeholder="Enter your login"
                value={loginName}
                onChange={(event) => setLoginName(event.target.value)}
              />
            </Field.Root>

            <Field.Root required>
              <Field.Label>Password</Field.Label>
              <InputGroup
                endElement={
                  <IconButton
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((shown) => !shown)}
                  >
                    {showPassword ? <LuEyeOff /> : <LuEye />}
                  </IconButton>
                }
              >
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </InputGroup>
            </Field.Root>

            {error && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
            )}

            <Button type="submit" colorPalette="blue" w="full" loading={submitting} loadingText="Signing in…">
              Sign in
            </Button>
          </Stack>
        </chakra.form>
      </Flex>
    </Flex>
  );
}
