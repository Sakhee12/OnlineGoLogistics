import { api } from "./axios";
import "../api/interceptor";

export interface CreateComplaintRequest {
    subject: string;
    description: string;
    receiptNo: string;
    priority?: "Low" | "Medium" | "High";
    contactName?: string;
    contactMobile?: string;
}

export interface ComplaintResponse {
    _id: string;
    subject: string;
    description: string;
    receiptNo: string;
    status: string;
    priority: string;
    createdAt: string;
}

export const createComplaintApi = async (
    data: CreateComplaintRequest
): Promise<ComplaintResponse> => {
    const res = await api.post<ComplaintResponse>("/api/complaints", data);
    return res.data;
};
