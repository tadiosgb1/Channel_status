function GenerateQuery(date, check = false) {
  const no = 10;
  check_queries = {
    check: {
      Telebir_outgoing: `select INITSTATUS,CBSSTATUS,PARTNERSTATUS,ENTRY_DATE from p1fchwgbm.partner_trn_request order by ENTRY_DATE desc FETCH FIRST ${no} ROWS ONLY`,
      Telebirr_incomming: `select CBSSTATUS,ENTRY_DATE from p1fchwgbm.partner_incoming_request order by ENTRY_DATE desc FETCH FIRST ${no} ROWS ONLY`,

      Other_bank_outgoing: `SELECT NOTIFICATION_STATUS,TIMESTAMP from p1fchwgbm.FTTB_ETH_OUT_WSO2_CUSTOM order by REQUEST_IN_TIME desc FETCH FIRST ${no} ROWS ONLY`,
      Other_bank_incomming: `SELECT NOTIFICATION_STATUS,RESPONSE_OUT_TIME,REQUEST_IN_TIME from p1fchwgbm.FTTB_ETH_IN_WSO2_CUSTOM order by REQUEST_IN_TIME desc FETCH FIRST ${no} ROWS ONLY`,

      Flygate: `select NOTIF_STATUS,CREATED_DT from P1FCHWGBM.WOGSC_FLYGATE_PAYMENT_DETAILS order by CREATED_DT desc FETCH FIRST ${no} ROWS ONLY`,
      Awach: `select NOTIF_STATUS,LAST_RESPONSE,CREATED_DT from P1FCHWGBM.WOGSC_AWACH_PAYMENT order by CREATED_DT desc FETCH FIRST ${no} ROWS ONLY`,
      School: `select TYPE,PMT_DT from p1fchwgbm.wogsc_billpmt_rec order by PMT_DT desc FETCH FIRST ${no} ROWS ONLY`,
    },
  };
  const status = {
    datecheck: {
    datecheck: `
      SELECT Auth_TIMESTAMP
      FROM p1fchwgbm.acvw_all_ac_entries
      WHERE TRN_DT >= TO_DATE('${date}', 'DD-MON-RR') 
      ORDER BY TRN_DT ASC
      FETCH FIRST 1 ROWS ONLY
    `
  },
    other: {
      m_to_other_bank_count_compare: `select count(TRN_REF_NO) from p1fchwgbm.fttb_eth_OUT_wso2_custom where TXN_DATE>='${date}' and REQUEST_TYPE='CREDIT_TRANSFER'`,
      u_payment_sum: `select sum(LCY_AMOUNT) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='PROFINCHEX' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}'and TRN_CODE <>'CHG'  and TRN_REF_NO NOT like '%FTUS%'and TRN_REF_NO NOT like'%TBAW%'and TRN_REF_NO NOT like'%IPOU%' and  TRN_REF_NO NOT like'%ETRF%'and  TRN_REF_NO NOT like'%FTAT%' and ac_no<>'0877060121605' and ac_no<>'1020570721601' and ac_no not like '17%' and EVENT='INIT'`,
      m_to_wegagen_bank_count: `select  count(*)from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and TRN_CODE ='AAT' and TRN_REF_NO like'%FTUS%'and EVENT='INIT'`,
      m_to_wegagen_bank_sum: `select  sum(LCY_AMOUNT) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and TRN_CODE ='AAT' and TRN_REF_NO like'%FTUS%' and EVENT='INIT'`,

      m_topup_count: `select count(*) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' and TRN_DT>='${date}' and DRCR_IND='C'and AC_NO ='0837904621602'`,
      m_topup_sum: `select sum(LCY_AMOUNT)  from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' and DRCR_IND='C' and TRN_DT>='${date}' and AC_NO ='0837904621602'`,
      m_telebirr_count: `select COUNT(*) from p1fchwgbm.WSO2_TELEBIRR_OUTGOING  where ENTRY_DATE>='${date}' AND MAKER_ID ='MOBILE' and CBSSTATUS='C' and  PARTNERRESPONSESTATUS=2`,
      m_telebirr_sum: `select sum(LCY_AMOUNT) from p1fchwgbm.WSO2_TELEBIRR_OUTGOING  where ENTRY_DATE>='${date}' AND MAKER_ID ='MOBILE' and CBSSTATUS='C' and  PARTNERRESPONSESTATUS=2`,

      u_topup_count: `select COUNT(*) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='PROFINCHEX' and TRN_DT>='${date}' and DRCR_IND='C' and AC_NO ='0837904621602'`,
      u_topup_sum: `select sum(LCY_AMOUNT)  from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='PROFINCHEX'  and TRN_DT>='${date}' and AC_NO ='0837904621602' and DRCR_IND='C'`,
      u_telebirr_count: `select  COUNT(*) from p1fchwgbm.partner_trn_request where ENTRY_DATE>='${date}' AND MAKER_ID ='USSD' and CBSSTATUS='C' and  PARTNERRESPONSESTATUS=2`,
      u_telebirr_sum: `select SUM(LCY_AMOUNT) from p1fchwgbm.partner_trn_request where ENTRY_DATE>='${date}' AND MAKER_ID ='USSD' and CBSSTATUS='C' and PARTNERRESPONSESTATUS=2`,
    },
    sum: {
      m_payment_sum: `select  sum(LCY_AMOUNT) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and ac_no not like '811%' and TRN_CODE <>'CHG' and TRN_REF_NO NOT like '%FTUS%'and TRN_REF_NO NOT like'%TBAW%'and TRN_REF_NO NOT like'%IPOU%' and TRN_REF_NO NOT like'%FTAT%'and EVENT='INIT'`,
      u_to_wegagen_bank_sum: `select sum(LCY_AMOUNT) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='PROFINCHEX' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and TRN_CODE ='AAT' and EVENT='INIT' and TRN_REF_NO like'%FTUS%'`,
      m_to_other_bank_sum: `select sum(LCY_AMOUNT)  from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and TRN_CODE ='FTD' and EVENT='INIT' and TRN_REF_NO like'%IPOU%' and AC_NO not like'222%'`,
    },
    sum2: {
      u_payment_count: `select  count(*) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='PROFINCHEX' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and TRN_CODE <>'CHG' and TRN_REF_NO NOT like '%FTUS%'and TRN_REF_NO NOT like'%TBAW%'and TRN_REF_NO NOT like'%IPOU%' and  TRN_REF_NO NOT like'%ETRF%' and TRN_REF_NO NOT like'%FTAT%'and ac_no<>'0877060121605' and ac_no<>'1020570721601' and ac_no not like '17%'and EVENT='INIT'`,
      m_payment_count: `select  count(*) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and ac_no not like '811%' and TRN_CODE <>'CHG' and TRN_REF_NO NOT like '%FTUS%'and TRN_REF_NO NOT like'%TBAW%'and TRN_REF_NO NOT like'%IPOU%' and TRN_REF_NO NOT like'%FTAT%'and EVENT='INIT'`,
      // m_ips_qr_count: `select count(*) as number_of_trn from P1FCHWGBM.ips_out_log where request_type!='BEN_ENQUIRY' and NOTIFICATION_STATUS='S' and REVERSAL_STATUS is null and txn_date = '${date}' and source = 'MOBILE'`,
      m_ips_qr_count: `select count(LCY_AMOUNT) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}'  and TRN_CODE ='FTD' and EVENT='INIT' and TRN_REF_NO like'%IPOU%'`,
      m_qr_count: `select count(AMOUNT) from p1fchwgbm.IPS_OUT_LOG where SOURCE='USSD' and TXN_DATE>='${date}'  and REQUEST_TYPE ='QR' and NOTIFICATION_STATUS='S' and CBS_STAT='S' and REVERSAL_STATUS is null`,
      // m_ips_qr_sum: `select sum(amount) sum_of_trn from P1FCHWGBM.ips_out_log where NOTIFICATION_STATUS='S' and request_type!='BEN_ENQUIRY' and REVERSAL_STATUS is null and txn_date = '${date}' and source = 'MOBILE'`,
      m_ips_qr_sum: `select sum(LCY_AMOUNT) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}'  and TRN_CODE ='FTD' and EVENT='INIT' and TRN_REF_NO like'%IPOU%'`,
      m_qr_sum: `select sum(AMOUNT) from p1fchwgbm.IPS_OUT_LOG where SOURCE='USSD' and TXN_DATE>='${date}'  and REQUEST_TYPE ='QR' and NOTIFICATION_STATUS='S' and CBS_STAT='S' and REVERSAL_STATUS is null`,
    },
    count: {
      u_to_wegagen_bank_count: `select  COUNT(*) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='PROFINCHEX' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and TRN_CODE ='AAT' and EVENT='INIT' and TRN_REF_NO like'%FTUS%'`,
      m_to_other_bank_count: `select COUNT(*) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='MBUSER' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}'and TRN_CODE ='FTD' and EVENT='INIT' and TRN_REF_NO like'%IPOU%' and AC_NO not like'222%'`,
    },
    external: {
      u_to_other_bank_count: `select COUNT(*) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='PROFINCHEX' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}' and TRN_CODE ='FTD' and EVENT='INIT' and TRN_REF_NO like'%IPOU%'`,
      u_to_other_bank_count_compare: `select COUNT(TRN_REF_NO) from p1fchwgbm.fttb_eth_OUT_wso2_custom where TXN_DATE>='${date}' and REQUEST_TYPE='CREDIT_TRANSFER' and SOURCE='USSD'`,
      u_to_other_bank_sum: `select SUM(LCY_AMOUNT) from p1fchwgbm.ACTBS_DAILY_LOG where USER_ID='PROFINCHEX' AND DRCR_IND='D' and ac_no not like '8%' and TRN_DT>='${date}'  and TRN_CODE ='FTD' and EVENT='INIT' and TRN_REF_NO like'%IPOU%'`,
    },
    mysql: {
      ussd_count: `select count(P.msisdn) from pinHashed P WHERE P.id IN (SELECT customer_id FROM customer_account) AND P.disable='E'`,
      app_count: `SELECT COUNT(a.phone) FROM activation_code a JOIN pinHashed c ON a.phone = c.msisdn WHERE c.id IN ( SELECT customer_id FROM customer_account)`,
    },
  };
  let query;
  query = check ? check_queries : status;
  return query;
}
module.exports = GenerateQuery;
