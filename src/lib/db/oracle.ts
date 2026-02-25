/**
 * Oracle Database Connection Manager
 *
 * Manages connections to multiple Oracle facility databases.
 * Uses node-oracledb with connection pooling.
 *
 * NOTE: Install node-oracledb before using:
 *   npm install oracledb
 *   Also requires Oracle Instant Client installed on the system.
 */

// import oracledb from "oracledb";

export interface OracleConnectionConfig {
  host: string;
  port: number;
  sid: string;
  user: string;
  password: string;
}

// Facility Oracle connection configurations from environment
export const ORACLE_FACILITIES: Record<string, OracleConnectionConfig> = {
  CEN: {
    host: process.env.ORA_CEN_HOST || "10.30.154.158",
    port: parseInt(process.env.ORA_CEN_PORT || "1521"),
    sid: process.env.ORA_CEN_SID || "hclab",
    user: process.env.ORA_CEN_USER || "",
    password: process.env.ORA_CEN_PASSWORD || "",
  },
  SMB: {
    host: process.env.ORA_SMB_HOST || "10.54.154.20",
    port: parseInt(process.env.ORA_SMB_PORT || "1521"),
    sid: process.env.ORA_SMB_SID || "hclab",
    user: process.env.ORA_SMB_USER || "",
    password: process.env.ORA_SMB_PASSWORD || "",
  },
  LIN: {
    host: process.env.ORA_LIN_HOST || "10.52.154.20",
    port: parseInt(process.env.ORA_LIN_PORT || "1521"),
    sid: process.env.ORA_LIN_SID || "hclab",
    user: process.env.ORA_LIN_USER || "",
    password: process.env.ORA_LIN_PASSWORD || "",
  },
  TAR: {
    host: process.env.ORA_TAR_HOST || "10.55.154.25",
    port: parseInt(process.env.ORA_TAR_PORT || "1521"),
    sid: process.env.ORA_TAR_SID || "hclab",
    user: process.env.ORA_TAR_USER || "",
    password: process.env.ORA_TAR_PASSWORD || "",
  },
  SRL: {
    host: process.env.ORA_SRL_HOST || "10.56.154.22",
    port: parseInt(process.env.ORA_SRL_PORT || "1521"),
    sid: process.env.ORA_SRL_SID || "hclab",
    user: process.env.ORA_SRL_USER || "",
    password: process.env.ORA_SRL_PASSWORD || "",
  },
  PAR: {
    host: process.env.ORA_PAR_HOST || "10.48.154.22",
    port: parseInt(process.env.ORA_PAR_PORT || "1521"),
    sid: process.env.ORA_PAR_SID || "hclab",
    user: process.env.ORA_PAR_USER || "",
    password: process.env.ORA_PAR_PASSWORD || "",
  },
  DTU: {
    host: process.env.ORA_DTU_HOST || "10.30.154.8",
    port: parseInt(process.env.ORA_DTU_PORT || "1521"),
    sid: process.env.ORA_DTU_SID || "erosprod",
    user: process.env.ORA_DTU_USER || "",
    password: process.env.ORA_DTU_PASSWORD || "",
  },
};

function buildConnectionString(config: OracleConnectionConfig): string {
  return `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${config.host})(PORT=${config.port}))(CONNECT_DATA=(SID=${config.sid})))`;
}

/**
 * Get an Oracle connection for a specific facility.
 *
 * Usage:
 *   const conn = await getOracleConnection("CEN");
 *   const result = await conn.execute("SELECT * FROM ...", [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
 *   await conn.close();
 */
export async function getOracleConnection(facilityCode: string) {
  const config = ORACLE_FACILITIES[facilityCode];
  if (!config) {
    throw new Error(`Unknown Oracle facility: ${facilityCode}`);
  }

  // Uncomment when oracledb is installed:
  // const connection = await oracledb.getConnection({
  //   user: config.user,
  //   password: config.password,
  //   connectString: buildConnectionString(config),
  // });
  // return connection;

  throw new Error(
    "Oracle connection not configured. Install oracledb and Oracle Instant Client first."
  );
}

/**
 * Execute a parameterized query against an Oracle facility database.
 * Always uses bind parameters to prevent SQL injection.
 */
export async function executeOracleQuery(
  facilityCode: string,
  sql: string,
  binds: Record<string, unknown> = {}
) {
  const conn = await getOracleConnection(facilityCode);
  try {
    // const result = await conn.execute(sql, binds, {
    //   outFormat: oracledb.OUT_FORMAT_OBJECT,
    //   autoCommit: true,
    // });
    // return result;
    throw new Error("Not implemented — install oracledb first");
  } finally {
    // await conn.close();
  }
}
