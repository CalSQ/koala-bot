export type InfractionType = "Timeout" | "Ban" | "Kick";

export interface Infraction {
    action: InfractionType,
    modId?: string,
    reason?: string,
    until?: number,
    at: number
};