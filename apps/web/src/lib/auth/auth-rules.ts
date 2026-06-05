type PasswordLoginInput = {
  emailVerified: Date | null;
  passwordMatches: boolean;
};

type ExistingAccountInput = {
  emailVerified: Date | null;
  hasPasswordHash: boolean;
};

export function canUsePasswordLogin(input: PasswordLoginInput) {
  return input.passwordMatches;
}

export function shouldReplaceExistingAccountPassword(input: ExistingAccountInput) {
  return !input.hasPasswordHash;
}
