import { createContext, ReactNode, useMemo, useState } from "react";
// utils
import {
  AnyObject,
  ReportDataShape,
  ReportDetails,
  ReportContextShape,
  ReportStatusShape,
} from "types";
import {
  getReportData,
  writeReportData,
  getReport,
  getReportsByState,
  writeReport,
  deleteReport,
} from "utils";
// verbiage
import { reportErrors } from "verbiage/errors";

export const ReportContext = createContext<ReportContextShape>({
  reportStatus: undefined as AnyObject | undefined,
  reportData: undefined as AnyObject | undefined,
  reportsByState: undefined as AnyObject | undefined,
  fetchReportData: Function,
  updateReportData: Function,
  fetchReport: Function,
  updateReport: Function,
  fetchReportsByState: Function,
  removeReport: Function,
  programName: undefined,
  setProgramName: Function,
  errorMessage: undefined,
});

export const ReportProvider = ({ children }: Props) => {
  const [reportStatus, setReportStatus] = useState<
    ReportStatusShape | undefined
  >();
  const [reportData, setReportData] = useState<ReportDataShape | undefined>();
  const [reportsByState, setReportsByState] = useState<any>();
  const [error, setError] = useState<string>();
  const [programName, setProgramName] = useState<string>();

  const fetchReportData = async (reportDetails: ReportDetails) => {
    try {
      const result = await getReportData(reportDetails);
      setReportData(result.reportData);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_DATA_FAILED);
    }
  };

  const updateReportData = async (
    reportDetails: ReportDetails,
    reportData: ReportDataShape
  ) => {
    try {
      await writeReportData(reportDetails, reportData);
      await fetchReportData(reportDetails);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_DATA_FAILED);
    }
  };

  const fetchReport = async (reportDetails: ReportDetails) => {
    try {
      const result = await getReport(reportDetails);
      setReportStatus(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORT_FAILED);
    }
  };

  const fetchReportsByState = async (state: string) => {
    try {
      const result = await getReportsByState(state);
      setReportsByState(result);
    } catch (e: any) {
      setError(reportErrors.GET_REPORTS_BY_STATE_FAILED);
    }
  };

  const updateReport = async (
    reportDetails: ReportDetails,
    reportStatus: string
  ) => {
    try {
      await writeReport(reportDetails, reportStatus);
      await fetchReport(reportDetails);
    } catch (e: any) {
      setError(reportErrors.SET_REPORT_FAILED);
    }
  };

  const removeReport = async (reportDetails: ReportDetails) => {
    try {
      await deleteReport(reportDetails);
    } catch (e: any) {
      setError(reportErrors.DELETE_REPORT_FAILED);
    }
  };

  const providerValue = useMemo(
    () => ({
      reportStatus,
      reportData,
      reportsByState,
      fetchReportData,
      updateReportData,
      fetchReport,
      fetchReportsByState,
      updateReport,
      removeReport,
      programName,
      setProgramName,
      errorMessage: error,
    }),
    [reportData, reportStatus, error, programName]
  );

  return (
    <ReportContext.Provider value={providerValue}>
      {children}
    </ReportContext.Provider>
  );
};

interface Props {
  children?: ReactNode;
}
