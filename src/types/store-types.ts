import { CombinedData, InstrumentCoverInfo } from "./types";

export interface Store {
  instrumentHistoryList: InstrumentCoverInfo[];
  searching: boolean
  isLeftCollapsed: boolean;
  searchTerm:string,
  selectedInstrument?: InstrumentCoverInfo | null;
  selectTheme: boolean;
  mobileView: 'search' | 'data' | 'chat';
  isMobile: boolean;
  setInstrumentHistoryList: (list: InstrumentCoverInfo[]) => void;
  addToInstrumentToList: (instrument: InstrumentCoverInfo) => void;
  setSearching:() =>void
  setIsLeftCollapsed: () => void;
  setSearchTerm: (term:string)=>void;
  setSelectedInstrument: (instrument: InstrumentCoverInfo)=>void;
  setSelectTheme: (value: boolean) => void;
  setMobileView: (view: 'search' | 'data' | 'chat') => void;
  setIsMobile: (value: boolean) => void;
}

export interface DataStore {
  data: CombinedData[];
  setData: (newData: CombinedData[]) => void;
  addData: (newData: CombinedData) => void;
}


export interface UserData {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  instrument_history: InstrumentCoverInfo[];
  is_paid_member: boolean;
  theme?: string;
}

export interface UserStore {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}
