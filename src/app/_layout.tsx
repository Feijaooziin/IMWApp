import { AuthProvider } from "@/context/AuthContext";
import LoginLayout from "./(auth)/_layout";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LoginLayout />
    </AuthProvider>
  );
}
