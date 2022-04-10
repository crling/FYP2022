import { event } from "crux/dist/utils";

function throwError(message: string): never {
    event.emit(event.DATA_LOADING_FAILED, message);
    throw new Error(message);
}
