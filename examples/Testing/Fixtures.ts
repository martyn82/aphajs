
import {Account} from "./Account";

export namespace Fixtures {
    export const AccountId = "accountId";
    export const AccountEmailAddress = "emailaddress";
    export const AccountPassword = "passwd";

    export const RegisterAccount = new Account.Register(AccountId, AccountEmailAddress, AccountPassword);
    export const AccountRegistered = new Account.Registered(AccountId, AccountEmailAddress, AccountPassword);

    export const ActivateAccount = new Account.Activate(AccountId);
    export const AccountActivated = new Account.Activated(AccountId);

    export const DeactivateAccount = new Account.Deactivate(AccountId);
    export const AccountDeactivated = new Account.Deactivated(AccountId);
}
