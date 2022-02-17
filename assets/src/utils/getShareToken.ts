import { isClientRequest } from "../stores/constant_state";

export default function (): string {
    if (!isClientRequest()) {
        throw new Error(
            "Client is not requesting so it does not have a share token."
        );
    }

    const splitPath = window.location.pathname.split("/");
    return splitPath[splitPath.length - 1];
}
