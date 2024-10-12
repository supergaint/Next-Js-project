 import { Message } from "@/model/User";
 export interface ApiResponce {
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Message[];
}