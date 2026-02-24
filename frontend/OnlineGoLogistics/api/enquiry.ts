import { api } from "./axios";

export interface CreateEnquiryRequest {
    name: string;
    mobile: string;
    message: string;
}

export interface EnquiryResponse {
    _id: string;
    name: string;
    mobile: string;
    message: string;
    status: string;
    createdAt: string;
}

export const createEnquiryApi = async (
    data: CreateEnquiryRequest
): Promise<EnquiryResponse> => {
    const res = await api.post<EnquiryResponse>("/api/enquiries", data);
    return res.data;
};
