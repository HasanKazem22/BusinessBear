import { apiFetch } from "@/lib/api";

export type InquiryStatus = "NEW" | "READ" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";

export interface ContactMessageRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const contactService = {
  /** Submit contact message from public home page */
  async submitMessage(data: ContactMessageRequest): Promise<{ success: boolean; data?: ContactMessageResponse; message?: string }> {
    return apiFetch("/contact-messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /** Admin: fetch paginated contact messages with optional status filter */
  async getAllMessages(status?: string, page = 0, size = 10): Promise<{ success: boolean; data: PageResponse<ContactMessageResponse> }> {
    const query = new URLSearchParams();
    if (status && status !== "ALL") {
      query.append("status", status);
    }
    query.append("page", page.toString());
    query.append("size", size.toString());

    return apiFetch(`/contact-messages?${query.toString()}`);
  },

  /** Admin: update message status (e.g. NEW -> READ -> COMPLETED) */
  async updateStatus(id: number, status: InquiryStatus): Promise<{ success: boolean; data: ContactMessageResponse }> {
    return apiFetch(`/contact-messages/${id}/status?status=${status}`, {
      method: "PATCH",
    });
  },
};
