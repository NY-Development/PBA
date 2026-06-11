import api from '@/src/api/client';

// ==========================================
// TYPES
// ==========================================

export interface FileAsset {
  uri: string;
  name: string;
  type: string;
}

export interface VendorRegisterInput {
  store_name: string;
  description: string;
  payout_email: string;
  tin_number: string;
  logo: FileAsset;
  banner: FileAsset;
  license: FileAsset;
}

export interface VendorResponse {
  message: string;
  vendor: {
    id: string;
    userId: string;
    storeName: string;
    description: string;
    status: 'pending' | 'verified' | 'rejected';
    logoUrl: string;
    bannerUrl: string;
    [key: string]: unknown;
  };
}

// ==========================================
// SERVICE
// ==========================================

export const vendorService = {
  /**
   * POST /vendors/register
   * Registers a new vendor application with multipart file uploads.
   * Files: logo, banner, license (all required by backend).
   */
  register: async (data: VendorRegisterInput): Promise<VendorResponse> => {
    const formData = new FormData();

    // Text fields
    formData.append('store_name', data.store_name);
    formData.append('description', data.description);
    formData.append('payout_email', data.payout_email);
    formData.append('tin_number', data.tin_number);

    // File fields — React Native FormData accepts { uri, name, type }
    formData.append('logo', {
      uri: data.logo.uri,
      name: data.logo.name,
      type: data.logo.type,
    } as any);

    formData.append('banner', {
      uri: data.banner.uri,
      name: data.banner.name,
      type: data.banner.type,
    } as any);

    formData.append('license', {
      uri: data.license.uri,
      name: data.license.name,
      type: data.license.type,
    } as any);

    const response = await api.post<VendorResponse>('vendors/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  },
};
