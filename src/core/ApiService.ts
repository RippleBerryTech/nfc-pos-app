import Axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import {authEndpoints, BASE_URL, mainEndpoints} from '~/constants';
import {
  CreateTransactionHistoryApiResponse,
  CreateTransactionHistoryResponse,
  GetClientApiResponse,
  GetClientResponse,
  GetIssuanceHistoryApiRequest,
  GetIssuanceHistoryApiResponse,
  GetIssuanceHistoryResponse,
  GetMerchantIdApiResponse,
  GetMerchantIdResponse,
  IssuanceHistory,
  LoginApiRequest,
  LoginApiResponse,
  LoginResponse,
  Transaction,
} from '~/types';
import {getAuthToken} from './LocalStorageService';

const axios = Axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': ' application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

const getAxiosInstanceWithAuthHeader: () => Promise<AxiosInstance> =
  async () => {
    const authToken = await getAuthToken();

    const _axios = Axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': ' application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      timeout: 15000,
    });

    return _axios;
  };

export const doLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<
      LoginApiResponse,
      AxiosResponse<LoginApiResponse, LoginApiRequest>,
      LoginApiRequest
    >(authEndpoints.login, {email, password});

    return {
      data: response.data?.data,
    };
  } catch (error) {
    if (Axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<LoginApiResponse, LoginApiRequest>;
      console.log('Axios error: ', axiosError?.response?.data ?? axiosError);

      if (axiosError.response.status === 400) {
        return {
          message: 'email or password is incorrect',
        };
      }

      return {
        message: axiosError?.response?.data?.message ?? 'Something went wrong',
      };
    } else {
      console.log('Error Sending login request: ', error);

      return {
        message: error?.message ?? 'Something went wrong',
      };
    }
  }
};

export const doGetIssuanceHistory: (
  pinCode: string,
  cardId: string,
) => Promise<GetIssuanceHistoryResponse> = async (pinCode, cardId) => {
  try {
    const axios = await getAxiosInstanceWithAuthHeader();

    const response = await axios.post<
      GetIssuanceHistoryApiResponse,
      AxiosResponse<
        GetIssuanceHistoryApiResponse,
        GetIssuanceHistoryApiRequest
      >,
      GetIssuanceHistoryApiRequest
    >(mainEndpoints.getIssuanceHistory, {
      pinCode,
      nfcCardId: cardId,
    });

    if (response.data?.data) {
      const issuanceHistory: IssuanceHistory = {
        ...response.data.data.data,
        clientCode: response.data.data?.clientCodeAndFullName?.Code,
        clientName: response.data.data?.clientCodeAndFullName?.FullName,
      };

      return {
        data: issuanceHistory,
      };
    }
  } catch (error) {
    console.log('Error Getting Issuance Histroy: ', error);

    if (Axios.isAxiosError(error)) {
      const _error = error as AxiosError<GetIssuanceHistoryApiResponse>;

      return {
        message: _error.response.data?.error || 'Something went wrong',
      };
    }

    return {
      message: 'Something went wrong',
    };
  }
};

export const doGetClient: (
  clientId: string,
) => Promise<GetClientResponse> = async clientId => {
  try {
    const axios = await getAxiosInstanceWithAuthHeader();

    const response = await axios.get<
      GetClientApiResponse,
      AxiosResponse<GetClientApiResponse>
    >(mainEndpoints.getClient(clientId));

    return {
      data: response.data,
    };
  } catch (error) {
    console.log('Error Getting Client: ', error);

    return {
      message: 'Something went wrong',
    };
  }
};

export const doGetMerchantId: (
  userId: string,
) => Promise<GetMerchantIdResponse> = async userId => {
  try {
    const axios = await getAxiosInstanceWithAuthHeader();

    const response = await axios.get<
      GetMerchantIdApiResponse,
      AxiosResponse<GetMerchantIdApiResponse>
    >(mainEndpoints.getMerchantId(userId));

    if (response.data?.data?.length > 0) {
      return {
        data: response.data.data[0]?.id,
      };
    } else {
      return {
        message: 'Something went wrong',
      };
    }
  } catch (error) {
    console.log('Error getting merchant id', error);

    return {
      message: 'Something went wrong',
    };
  }
};

export const doCreateTrasactionHistory: (
  transaction: Transaction,
) => Promise<CreateTransactionHistoryResponse> = async transaction => {
  try {
    const axios = await getAxiosInstanceWithAuthHeader();

    const apiResponse = await axios.post<
      CreateTransactionHistoryApiResponse,
      AxiosResponse<CreateTransactionHistoryApiResponse, Transaction>,
      Transaction
    >(mainEndpoints.createTransactionHistory, transaction);

    return {
      success: true,
      message: apiResponse.data.message,
    };
  } catch (error) {
    console.log('Error creating transaction history', error);

    return {
      success: false,
      message: 'Something went wrong',
    };
  }
};
