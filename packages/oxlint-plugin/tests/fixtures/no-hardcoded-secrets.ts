interface StoreCredential {
  readonly secretAccessKey: string;
}

const untyped = { secretAccessKey: "hunter2" }; // EXPECT @rikalabs/no-hardcoded-secrets
const annotated: StoreCredential = { secretAccessKey: "hunter2" }; // EXPECT @rikalabs/no-hardcoded-secrets
const asserted = { secretAccessKey: "hunter2" } as StoreCredential; // EXPECT @rikalabs/no-hardcoded-secrets
const satisfied = { secretAccessKey: "hunter2" } satisfies StoreCredential; // EXPECT @rikalabs/no-hardcoded-secrets
const configured: StoreCredential = {
  secretAccessKey: process.env.SECRET_ACCESS_KEY ?? "",
};

void untyped;
void annotated;
void asserted;
void satisfied;
void configured;
