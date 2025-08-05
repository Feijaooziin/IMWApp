import { Alert } from "react-native";

type SupabaseError = {
  message: string;
  code?: string;
};

export function useSupabaseErrorHandler() {
  function handleSupabaseError(error: SupabaseError | null) {
    if (!error) return;

    const errorMessages: Record<string, string> = {
      "Invalid login credentials": "E-mail ou senha incorretos.",

      "Email not confirmed": "Confirme seu e-mail antes de entrar.",

      "User already registered": "Este e-mail já está cadastrado.",

      "Password should be at least 8 characters.":
        "A senha deve ter pelo menos 8 caracteres.",

      "Anonymous sign-ins are disabled":
        "Preencha todos os campos para se cadastrar.",

      "Signup requires a valid password":
        "Escolha uma senha para se cadastrar.",

      "User already registred": "Email já cadastrado.",

      "missing email or phone": "Preencha o Email.",
    };

    // Prioriza código se disponível, senão usa mensagem
    let userMessage =
      (error.code && errorMessages[error.code]) ||
      errorMessages[error.message] ||
      "Ocorreu um erro inesperado. Tente novamente.";

    Alert.alert("Erro", userMessage);
  }

  return { handleSupabaseError };
}
