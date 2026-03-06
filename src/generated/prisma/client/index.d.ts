
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Queue
 * 
 */
export type Queue = $Result.DefaultSelection<Prisma.$QueuePayload>
/**
 * Model CmsVitals
 * Real CMS V2 vitals table — Medication/LastDose/LastPeriod recorded at nursing station
 */
export type CmsVitals = $Result.DefaultSelection<Prisma.$CmsVitalsPayload>
/**
 * Model Patient
 * 
 */
export type Patient = $Result.DefaultSelection<Prisma.$PatientPayload>
/**
 * Model CardEnrollment
 * 
 */
export type CardEnrollment = $Result.DefaultSelection<Prisma.$CardEnrollmentPayload>
/**
 * Model CardNumber
 * 
 */
export type CardNumber = $Result.DefaultSelection<Prisma.$CardNumberPayload>
/**
 * Model CardVerified
 * 
 */
export type CardVerified = $Result.DefaultSelection<Prisma.$CardVerifiedPayload>
/**
 * Model CmsCompany
 * 
 */
export type CmsCompany = $Result.DefaultSelection<Prisma.$CmsCompanyPayload>
/**
 * Model ConsultationNote
 * 
 */
export type ConsultationNote = $Result.DefaultSelection<Prisma.$ConsultationNotePayload>
/**
 * Model Vitals
 * 
 */
export type Vitals = $Result.DefaultSelection<Prisma.$VitalsPayload>
/**
 * Model PhysicalExamination
 * 
 */
export type PhysicalExamination = $Result.DefaultSelection<Prisma.$PhysicalExaminationPayload>
/**
 * Model MedicalEvaluation
 * 
 */
export type MedicalEvaluation = $Result.DefaultSelection<Prisma.$MedicalEvaluationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.queue`: Exposes CRUD operations for the **Queue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Queues
    * const queues = await prisma.queue.findMany()
    * ```
    */
  get queue(): Prisma.QueueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cmsVitals`: Exposes CRUD operations for the **CmsVitals** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CmsVitals
    * const cmsVitals = await prisma.cmsVitals.findMany()
    * ```
    */
  get cmsVitals(): Prisma.CmsVitalsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.patient`: Exposes CRUD operations for the **Patient** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Patients
    * const patients = await prisma.patient.findMany()
    * ```
    */
  get patient(): Prisma.PatientDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cardEnrollment`: Exposes CRUD operations for the **CardEnrollment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CardEnrollments
    * const cardEnrollments = await prisma.cardEnrollment.findMany()
    * ```
    */
  get cardEnrollment(): Prisma.CardEnrollmentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cardNumber`: Exposes CRUD operations for the **CardNumber** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CardNumbers
    * const cardNumbers = await prisma.cardNumber.findMany()
    * ```
    */
  get cardNumber(): Prisma.CardNumberDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cardVerified`: Exposes CRUD operations for the **CardVerified** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CardVerifieds
    * const cardVerifieds = await prisma.cardVerified.findMany()
    * ```
    */
  get cardVerified(): Prisma.CardVerifiedDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cmsCompany`: Exposes CRUD operations for the **CmsCompany** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CmsCompanies
    * const cmsCompanies = await prisma.cmsCompany.findMany()
    * ```
    */
  get cmsCompany(): Prisma.CmsCompanyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.consultationNote`: Exposes CRUD operations for the **ConsultationNote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConsultationNotes
    * const consultationNotes = await prisma.consultationNote.findMany()
    * ```
    */
  get consultationNote(): Prisma.ConsultationNoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vitals`: Exposes CRUD operations for the **Vitals** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vitals
    * const vitals = await prisma.vitals.findMany()
    * ```
    */
  get vitals(): Prisma.VitalsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.physicalExamination`: Exposes CRUD operations for the **PhysicalExamination** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PhysicalExaminations
    * const physicalExaminations = await prisma.physicalExamination.findMany()
    * ```
    */
  get physicalExamination(): Prisma.PhysicalExaminationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.medicalEvaluation`: Exposes CRUD operations for the **MedicalEvaluation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MedicalEvaluations
    * const medicalEvaluations = await prisma.medicalEvaluation.findMany()
    * ```
    */
  get medicalEvaluation(): Prisma.MedicalEvaluationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Queue: 'Queue',
    CmsVitals: 'CmsVitals',
    Patient: 'Patient',
    CardEnrollment: 'CardEnrollment',
    CardNumber: 'CardNumber',
    CardVerified: 'CardVerified',
    CmsCompany: 'CmsCompany',
    ConsultationNote: 'ConsultationNote',
    Vitals: 'Vitals',
    PhysicalExamination: 'PhysicalExamination',
    MedicalEvaluation: 'MedicalEvaluation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "queue" | "cmsVitals" | "patient" | "cardEnrollment" | "cardNumber" | "cardVerified" | "cmsCompany" | "consultationNote" | "vitals" | "physicalExamination" | "medicalEvaluation"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Queue: {
        payload: Prisma.$QueuePayload<ExtArgs>
        fields: Prisma.QueueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.QueueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.QueueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>
          }
          findFirst: {
            args: Prisma.QueueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.QueueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>
          }
          findMany: {
            args: Prisma.QueueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>[]
          }
          create: {
            args: Prisma.QueueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>
          }
          createMany: {
            args: Prisma.QueueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.QueueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>[]
          }
          delete: {
            args: Prisma.QueueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>
          }
          update: {
            args: Prisma.QueueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>
          }
          deleteMany: {
            args: Prisma.QueueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.QueueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.QueueUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>[]
          }
          upsert: {
            args: Prisma.QueueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$QueuePayload>
          }
          aggregate: {
            args: Prisma.QueueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateQueue>
          }
          groupBy: {
            args: Prisma.QueueGroupByArgs<ExtArgs>
            result: $Utils.Optional<QueueGroupByOutputType>[]
          }
          count: {
            args: Prisma.QueueCountArgs<ExtArgs>
            result: $Utils.Optional<QueueCountAggregateOutputType> | number
          }
        }
      }
      CmsVitals: {
        payload: Prisma.$CmsVitalsPayload<ExtArgs>
        fields: Prisma.CmsVitalsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CmsVitalsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CmsVitalsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>
          }
          findFirst: {
            args: Prisma.CmsVitalsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CmsVitalsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>
          }
          findMany: {
            args: Prisma.CmsVitalsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>[]
          }
          create: {
            args: Prisma.CmsVitalsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>
          }
          createMany: {
            args: Prisma.CmsVitalsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CmsVitalsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>[]
          }
          delete: {
            args: Prisma.CmsVitalsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>
          }
          update: {
            args: Prisma.CmsVitalsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>
          }
          deleteMany: {
            args: Prisma.CmsVitalsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CmsVitalsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CmsVitalsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>[]
          }
          upsert: {
            args: Prisma.CmsVitalsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsVitalsPayload>
          }
          aggregate: {
            args: Prisma.CmsVitalsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCmsVitals>
          }
          groupBy: {
            args: Prisma.CmsVitalsGroupByArgs<ExtArgs>
            result: $Utils.Optional<CmsVitalsGroupByOutputType>[]
          }
          count: {
            args: Prisma.CmsVitalsCountArgs<ExtArgs>
            result: $Utils.Optional<CmsVitalsCountAggregateOutputType> | number
          }
        }
      }
      Patient: {
        payload: Prisma.$PatientPayload<ExtArgs>
        fields: Prisma.PatientFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PatientFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PatientFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findFirst: {
            args: Prisma.PatientFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PatientFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          findMany: {
            args: Prisma.PatientFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          create: {
            args: Prisma.PatientCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          createMany: {
            args: Prisma.PatientCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PatientCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          delete: {
            args: Prisma.PatientDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          update: {
            args: Prisma.PatientUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          deleteMany: {
            args: Prisma.PatientDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PatientUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PatientUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>[]
          }
          upsert: {
            args: Prisma.PatientUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PatientPayload>
          }
          aggregate: {
            args: Prisma.PatientAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePatient>
          }
          groupBy: {
            args: Prisma.PatientGroupByArgs<ExtArgs>
            result: $Utils.Optional<PatientGroupByOutputType>[]
          }
          count: {
            args: Prisma.PatientCountArgs<ExtArgs>
            result: $Utils.Optional<PatientCountAggregateOutputType> | number
          }
        }
      }
      CardEnrollment: {
        payload: Prisma.$CardEnrollmentPayload<ExtArgs>
        fields: Prisma.CardEnrollmentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CardEnrollmentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CardEnrollmentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>
          }
          findFirst: {
            args: Prisma.CardEnrollmentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CardEnrollmentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>
          }
          findMany: {
            args: Prisma.CardEnrollmentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>[]
          }
          create: {
            args: Prisma.CardEnrollmentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>
          }
          createMany: {
            args: Prisma.CardEnrollmentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CardEnrollmentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>[]
          }
          delete: {
            args: Prisma.CardEnrollmentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>
          }
          update: {
            args: Prisma.CardEnrollmentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>
          }
          deleteMany: {
            args: Prisma.CardEnrollmentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CardEnrollmentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CardEnrollmentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>[]
          }
          upsert: {
            args: Prisma.CardEnrollmentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardEnrollmentPayload>
          }
          aggregate: {
            args: Prisma.CardEnrollmentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCardEnrollment>
          }
          groupBy: {
            args: Prisma.CardEnrollmentGroupByArgs<ExtArgs>
            result: $Utils.Optional<CardEnrollmentGroupByOutputType>[]
          }
          count: {
            args: Prisma.CardEnrollmentCountArgs<ExtArgs>
            result: $Utils.Optional<CardEnrollmentCountAggregateOutputType> | number
          }
        }
      }
      CardNumber: {
        payload: Prisma.$CardNumberPayload<ExtArgs>
        fields: Prisma.CardNumberFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CardNumberFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CardNumberFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>
          }
          findFirst: {
            args: Prisma.CardNumberFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CardNumberFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>
          }
          findMany: {
            args: Prisma.CardNumberFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>[]
          }
          create: {
            args: Prisma.CardNumberCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>
          }
          createMany: {
            args: Prisma.CardNumberCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CardNumberCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>[]
          }
          delete: {
            args: Prisma.CardNumberDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>
          }
          update: {
            args: Prisma.CardNumberUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>
          }
          deleteMany: {
            args: Prisma.CardNumberDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CardNumberUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CardNumberUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>[]
          }
          upsert: {
            args: Prisma.CardNumberUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardNumberPayload>
          }
          aggregate: {
            args: Prisma.CardNumberAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCardNumber>
          }
          groupBy: {
            args: Prisma.CardNumberGroupByArgs<ExtArgs>
            result: $Utils.Optional<CardNumberGroupByOutputType>[]
          }
          count: {
            args: Prisma.CardNumberCountArgs<ExtArgs>
            result: $Utils.Optional<CardNumberCountAggregateOutputType> | number
          }
        }
      }
      CardVerified: {
        payload: Prisma.$CardVerifiedPayload<ExtArgs>
        fields: Prisma.CardVerifiedFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CardVerifiedFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CardVerifiedFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>
          }
          findFirst: {
            args: Prisma.CardVerifiedFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CardVerifiedFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>
          }
          findMany: {
            args: Prisma.CardVerifiedFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>[]
          }
          create: {
            args: Prisma.CardVerifiedCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>
          }
          createMany: {
            args: Prisma.CardVerifiedCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CardVerifiedCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>[]
          }
          delete: {
            args: Prisma.CardVerifiedDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>
          }
          update: {
            args: Prisma.CardVerifiedUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>
          }
          deleteMany: {
            args: Prisma.CardVerifiedDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CardVerifiedUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CardVerifiedUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>[]
          }
          upsert: {
            args: Prisma.CardVerifiedUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CardVerifiedPayload>
          }
          aggregate: {
            args: Prisma.CardVerifiedAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCardVerified>
          }
          groupBy: {
            args: Prisma.CardVerifiedGroupByArgs<ExtArgs>
            result: $Utils.Optional<CardVerifiedGroupByOutputType>[]
          }
          count: {
            args: Prisma.CardVerifiedCountArgs<ExtArgs>
            result: $Utils.Optional<CardVerifiedCountAggregateOutputType> | number
          }
        }
      }
      CmsCompany: {
        payload: Prisma.$CmsCompanyPayload<ExtArgs>
        fields: Prisma.CmsCompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CmsCompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CmsCompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>
          }
          findFirst: {
            args: Prisma.CmsCompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CmsCompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>
          }
          findMany: {
            args: Prisma.CmsCompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>[]
          }
          create: {
            args: Prisma.CmsCompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>
          }
          createMany: {
            args: Prisma.CmsCompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CmsCompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>[]
          }
          delete: {
            args: Prisma.CmsCompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>
          }
          update: {
            args: Prisma.CmsCompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>
          }
          deleteMany: {
            args: Prisma.CmsCompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CmsCompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CmsCompanyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>[]
          }
          upsert: {
            args: Prisma.CmsCompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CmsCompanyPayload>
          }
          aggregate: {
            args: Prisma.CmsCompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCmsCompany>
          }
          groupBy: {
            args: Prisma.CmsCompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CmsCompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CmsCompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CmsCompanyCountAggregateOutputType> | number
          }
        }
      }
      ConsultationNote: {
        payload: Prisma.$ConsultationNotePayload<ExtArgs>
        fields: Prisma.ConsultationNoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConsultationNoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConsultationNoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>
          }
          findFirst: {
            args: Prisma.ConsultationNoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConsultationNoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>
          }
          findMany: {
            args: Prisma.ConsultationNoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>[]
          }
          create: {
            args: Prisma.ConsultationNoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>
          }
          createMany: {
            args: Prisma.ConsultationNoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConsultationNoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>[]
          }
          delete: {
            args: Prisma.ConsultationNoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>
          }
          update: {
            args: Prisma.ConsultationNoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>
          }
          deleteMany: {
            args: Prisma.ConsultationNoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConsultationNoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConsultationNoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>[]
          }
          upsert: {
            args: Prisma.ConsultationNoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConsultationNotePayload>
          }
          aggregate: {
            args: Prisma.ConsultationNoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConsultationNote>
          }
          groupBy: {
            args: Prisma.ConsultationNoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConsultationNoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConsultationNoteCountArgs<ExtArgs>
            result: $Utils.Optional<ConsultationNoteCountAggregateOutputType> | number
          }
        }
      }
      Vitals: {
        payload: Prisma.$VitalsPayload<ExtArgs>
        fields: Prisma.VitalsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VitalsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VitalsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>
          }
          findFirst: {
            args: Prisma.VitalsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VitalsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>
          }
          findMany: {
            args: Prisma.VitalsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>[]
          }
          create: {
            args: Prisma.VitalsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>
          }
          createMany: {
            args: Prisma.VitalsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VitalsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>[]
          }
          delete: {
            args: Prisma.VitalsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>
          }
          update: {
            args: Prisma.VitalsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>
          }
          deleteMany: {
            args: Prisma.VitalsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VitalsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VitalsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>[]
          }
          upsert: {
            args: Prisma.VitalsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VitalsPayload>
          }
          aggregate: {
            args: Prisma.VitalsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVitals>
          }
          groupBy: {
            args: Prisma.VitalsGroupByArgs<ExtArgs>
            result: $Utils.Optional<VitalsGroupByOutputType>[]
          }
          count: {
            args: Prisma.VitalsCountArgs<ExtArgs>
            result: $Utils.Optional<VitalsCountAggregateOutputType> | number
          }
        }
      }
      PhysicalExamination: {
        payload: Prisma.$PhysicalExaminationPayload<ExtArgs>
        fields: Prisma.PhysicalExaminationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhysicalExaminationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhysicalExaminationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>
          }
          findFirst: {
            args: Prisma.PhysicalExaminationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhysicalExaminationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>
          }
          findMany: {
            args: Prisma.PhysicalExaminationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>[]
          }
          create: {
            args: Prisma.PhysicalExaminationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>
          }
          createMany: {
            args: Prisma.PhysicalExaminationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PhysicalExaminationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>[]
          }
          delete: {
            args: Prisma.PhysicalExaminationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>
          }
          update: {
            args: Prisma.PhysicalExaminationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>
          }
          deleteMany: {
            args: Prisma.PhysicalExaminationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhysicalExaminationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PhysicalExaminationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>[]
          }
          upsert: {
            args: Prisma.PhysicalExaminationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicalExaminationPayload>
          }
          aggregate: {
            args: Prisma.PhysicalExaminationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhysicalExamination>
          }
          groupBy: {
            args: Prisma.PhysicalExaminationGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhysicalExaminationGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhysicalExaminationCountArgs<ExtArgs>
            result: $Utils.Optional<PhysicalExaminationCountAggregateOutputType> | number
          }
        }
      }
      MedicalEvaluation: {
        payload: Prisma.$MedicalEvaluationPayload<ExtArgs>
        fields: Prisma.MedicalEvaluationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MedicalEvaluationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MedicalEvaluationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>
          }
          findFirst: {
            args: Prisma.MedicalEvaluationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MedicalEvaluationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>
          }
          findMany: {
            args: Prisma.MedicalEvaluationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>[]
          }
          create: {
            args: Prisma.MedicalEvaluationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>
          }
          createMany: {
            args: Prisma.MedicalEvaluationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MedicalEvaluationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>[]
          }
          delete: {
            args: Prisma.MedicalEvaluationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>
          }
          update: {
            args: Prisma.MedicalEvaluationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>
          }
          deleteMany: {
            args: Prisma.MedicalEvaluationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MedicalEvaluationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MedicalEvaluationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>[]
          }
          upsert: {
            args: Prisma.MedicalEvaluationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MedicalEvaluationPayload>
          }
          aggregate: {
            args: Prisma.MedicalEvaluationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMedicalEvaluation>
          }
          groupBy: {
            args: Prisma.MedicalEvaluationGroupByArgs<ExtArgs>
            result: $Utils.Optional<MedicalEvaluationGroupByOutputType>[]
          }
          count: {
            args: Prisma.MedicalEvaluationCountArgs<ExtArgs>
            result: $Utils.Optional<MedicalEvaluationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    queue?: QueueOmit
    cmsVitals?: CmsVitalsOmit
    patient?: PatientOmit
    cardEnrollment?: CardEnrollmentOmit
    cardNumber?: CardNumberOmit
    cardVerified?: CardVerifiedOmit
    cmsCompany?: CmsCompanyOmit
    consultationNote?: ConsultationNoteOmit
    vitals?: VitalsOmit
    physicalExamination?: PhysicalExaminationOmit
    medicalEvaluation?: MedicalEvaluationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    created_by: number | null
    location_id: number | null
    manager_id: number | null
    company_id: number | null
    department_id: number | null
    remote: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    created_by: number | null
    location_id: number | null
    manager_id: number | null
    company_id: number | null
    department_id: number | null
    remote: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    permissions: string | null
    activated: boolean | null
    created_by: number | null
    activation_code: string | null
    activated_at: Date | null
    last_login: Date | null
    persist_code: string | null
    reset_password_code: string | null
    first_name: string | null
    last_name: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
    website: string | null
    country: string | null
    gravatar: string | null
    location_id: number | null
    phone: string | null
    jobtitle: string | null
    manager_id: number | null
    employee_num: string | null
    avatar: string | null
    username: string | null
    notes: string | null
    company_id: number | null
    remember_token: string | null
    ldap_import: boolean | null
    locale: string | null
    show_in_list: boolean | null
    two_factor_secret: string | null
    two_factor_enrolled: boolean | null
    two_factor_optin: boolean | null
    department_id: number | null
    address: string | null
    city: string | null
    state: string | null
    zip: string | null
    skin: string | null
    remote: number | null
    status: string | null
    role: string | null
    department: string | null
    accessmapid: string | null
    ldap_server_status: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    password: string | null
    permissions: string | null
    activated: boolean | null
    created_by: number | null
    activation_code: string | null
    activated_at: Date | null
    last_login: Date | null
    persist_code: string | null
    reset_password_code: string | null
    first_name: string | null
    last_name: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
    website: string | null
    country: string | null
    gravatar: string | null
    location_id: number | null
    phone: string | null
    jobtitle: string | null
    manager_id: number | null
    employee_num: string | null
    avatar: string | null
    username: string | null
    notes: string | null
    company_id: number | null
    remember_token: string | null
    ldap_import: boolean | null
    locale: string | null
    show_in_list: boolean | null
    two_factor_secret: string | null
    two_factor_enrolled: boolean | null
    two_factor_optin: boolean | null
    department_id: number | null
    address: string | null
    city: string | null
    state: string | null
    zip: string | null
    skin: string | null
    remote: number | null
    status: string | null
    role: string | null
    department: string | null
    accessmapid: string | null
    ldap_server_status: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password: number
    permissions: number
    activated: number
    created_by: number
    activation_code: number
    activated_at: number
    last_login: number
    persist_code: number
    reset_password_code: number
    first_name: number
    last_name: number
    created_at: number
    updated_at: number
    deleted_at: number
    website: number
    country: number
    gravatar: number
    location_id: number
    phone: number
    jobtitle: number
    manager_id: number
    employee_num: number
    avatar: number
    username: number
    notes: number
    company_id: number
    remember_token: number
    ldap_import: number
    locale: number
    show_in_list: number
    two_factor_secret: number
    two_factor_enrolled: number
    two_factor_optin: number
    department_id: number
    address: number
    city: number
    state: number
    zip: number
    skin: number
    remote: number
    status: number
    role: number
    department: number
    accessmapid: number
    ldap_server_status: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    created_by?: true
    location_id?: true
    manager_id?: true
    company_id?: true
    department_id?: true
    remote?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    created_by?: true
    location_id?: true
    manager_id?: true
    company_id?: true
    department_id?: true
    remote?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password?: true
    permissions?: true
    activated?: true
    created_by?: true
    activation_code?: true
    activated_at?: true
    last_login?: true
    persist_code?: true
    reset_password_code?: true
    first_name?: true
    last_name?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    website?: true
    country?: true
    gravatar?: true
    location_id?: true
    phone?: true
    jobtitle?: true
    manager_id?: true
    employee_num?: true
    avatar?: true
    username?: true
    notes?: true
    company_id?: true
    remember_token?: true
    ldap_import?: true
    locale?: true
    show_in_list?: true
    two_factor_secret?: true
    two_factor_enrolled?: true
    two_factor_optin?: true
    department_id?: true
    address?: true
    city?: true
    state?: true
    zip?: true
    skin?: true
    remote?: true
    status?: true
    role?: true
    department?: true
    accessmapid?: true
    ldap_server_status?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password?: true
    permissions?: true
    activated?: true
    created_by?: true
    activation_code?: true
    activated_at?: true
    last_login?: true
    persist_code?: true
    reset_password_code?: true
    first_name?: true
    last_name?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    website?: true
    country?: true
    gravatar?: true
    location_id?: true
    phone?: true
    jobtitle?: true
    manager_id?: true
    employee_num?: true
    avatar?: true
    username?: true
    notes?: true
    company_id?: true
    remember_token?: true
    ldap_import?: true
    locale?: true
    show_in_list?: true
    two_factor_secret?: true
    two_factor_enrolled?: true
    two_factor_optin?: true
    department_id?: true
    address?: true
    city?: true
    state?: true
    zip?: true
    skin?: true
    remote?: true
    status?: true
    role?: true
    department?: true
    accessmapid?: true
    ldap_server_status?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password?: true
    permissions?: true
    activated?: true
    created_by?: true
    activation_code?: true
    activated_at?: true
    last_login?: true
    persist_code?: true
    reset_password_code?: true
    first_name?: true
    last_name?: true
    created_at?: true
    updated_at?: true
    deleted_at?: true
    website?: true
    country?: true
    gravatar?: true
    location_id?: true
    phone?: true
    jobtitle?: true
    manager_id?: true
    employee_num?: true
    avatar?: true
    username?: true
    notes?: true
    company_id?: true
    remember_token?: true
    ldap_import?: true
    locale?: true
    show_in_list?: true
    two_factor_secret?: true
    two_factor_enrolled?: true
    two_factor_optin?: true
    department_id?: true
    address?: true
    city?: true
    state?: true
    zip?: true
    skin?: true
    remote?: true
    status?: true
    role?: true
    department?: true
    accessmapid?: true
    ldap_server_status?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string | null
    password: string | null
    permissions: string | null
    activated: boolean
    created_by: number | null
    activation_code: string | null
    activated_at: Date | null
    last_login: Date | null
    persist_code: string | null
    reset_password_code: string | null
    first_name: string | null
    last_name: string | null
    created_at: Date | null
    updated_at: Date | null
    deleted_at: Date | null
    website: string | null
    country: string | null
    gravatar: string | null
    location_id: number | null
    phone: string | null
    jobtitle: string | null
    manager_id: number | null
    employee_num: string | null
    avatar: string | null
    username: string | null
    notes: string | null
    company_id: number | null
    remember_token: string | null
    ldap_import: boolean
    locale: string | null
    show_in_list: boolean
    two_factor_secret: string | null
    two_factor_enrolled: boolean
    two_factor_optin: boolean
    department_id: number | null
    address: string | null
    city: string | null
    state: string | null
    zip: string | null
    skin: string | null
    remote: number | null
    status: string | null
    role: string | null
    department: string | null
    accessmapid: string | null
    ldap_server_status: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    permissions?: boolean
    activated?: boolean
    created_by?: boolean
    activation_code?: boolean
    activated_at?: boolean
    last_login?: boolean
    persist_code?: boolean
    reset_password_code?: boolean
    first_name?: boolean
    last_name?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    website?: boolean
    country?: boolean
    gravatar?: boolean
    location_id?: boolean
    phone?: boolean
    jobtitle?: boolean
    manager_id?: boolean
    employee_num?: boolean
    avatar?: boolean
    username?: boolean
    notes?: boolean
    company_id?: boolean
    remember_token?: boolean
    ldap_import?: boolean
    locale?: boolean
    show_in_list?: boolean
    two_factor_secret?: boolean
    two_factor_enrolled?: boolean
    two_factor_optin?: boolean
    department_id?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zip?: boolean
    skin?: boolean
    remote?: boolean
    status?: boolean
    role?: boolean
    department?: boolean
    accessmapid?: boolean
    ldap_server_status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    permissions?: boolean
    activated?: boolean
    created_by?: boolean
    activation_code?: boolean
    activated_at?: boolean
    last_login?: boolean
    persist_code?: boolean
    reset_password_code?: boolean
    first_name?: boolean
    last_name?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    website?: boolean
    country?: boolean
    gravatar?: boolean
    location_id?: boolean
    phone?: boolean
    jobtitle?: boolean
    manager_id?: boolean
    employee_num?: boolean
    avatar?: boolean
    username?: boolean
    notes?: boolean
    company_id?: boolean
    remember_token?: boolean
    ldap_import?: boolean
    locale?: boolean
    show_in_list?: boolean
    two_factor_secret?: boolean
    two_factor_enrolled?: boolean
    two_factor_optin?: boolean
    department_id?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zip?: boolean
    skin?: boolean
    remote?: boolean
    status?: boolean
    role?: boolean
    department?: boolean
    accessmapid?: boolean
    ldap_server_status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password?: boolean
    permissions?: boolean
    activated?: boolean
    created_by?: boolean
    activation_code?: boolean
    activated_at?: boolean
    last_login?: boolean
    persist_code?: boolean
    reset_password_code?: boolean
    first_name?: boolean
    last_name?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    website?: boolean
    country?: boolean
    gravatar?: boolean
    location_id?: boolean
    phone?: boolean
    jobtitle?: boolean
    manager_id?: boolean
    employee_num?: boolean
    avatar?: boolean
    username?: boolean
    notes?: boolean
    company_id?: boolean
    remember_token?: boolean
    ldap_import?: boolean
    locale?: boolean
    show_in_list?: boolean
    two_factor_secret?: boolean
    two_factor_enrolled?: boolean
    two_factor_optin?: boolean
    department_id?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zip?: boolean
    skin?: boolean
    remote?: boolean
    status?: boolean
    role?: boolean
    department?: boolean
    accessmapid?: boolean
    ldap_server_status?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password?: boolean
    permissions?: boolean
    activated?: boolean
    created_by?: boolean
    activation_code?: boolean
    activated_at?: boolean
    last_login?: boolean
    persist_code?: boolean
    reset_password_code?: boolean
    first_name?: boolean
    last_name?: boolean
    created_at?: boolean
    updated_at?: boolean
    deleted_at?: boolean
    website?: boolean
    country?: boolean
    gravatar?: boolean
    location_id?: boolean
    phone?: boolean
    jobtitle?: boolean
    manager_id?: boolean
    employee_num?: boolean
    avatar?: boolean
    username?: boolean
    notes?: boolean
    company_id?: boolean
    remember_token?: boolean
    ldap_import?: boolean
    locale?: boolean
    show_in_list?: boolean
    two_factor_secret?: boolean
    two_factor_enrolled?: boolean
    two_factor_optin?: boolean
    department_id?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zip?: boolean
    skin?: boolean
    remote?: boolean
    status?: boolean
    role?: boolean
    department?: boolean
    accessmapid?: boolean
    ldap_server_status?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password" | "permissions" | "activated" | "created_by" | "activation_code" | "activated_at" | "last_login" | "persist_code" | "reset_password_code" | "first_name" | "last_name" | "created_at" | "updated_at" | "deleted_at" | "website" | "country" | "gravatar" | "location_id" | "phone" | "jobtitle" | "manager_id" | "employee_num" | "avatar" | "username" | "notes" | "company_id" | "remember_token" | "ldap_import" | "locale" | "show_in_list" | "two_factor_secret" | "two_factor_enrolled" | "two_factor_optin" | "department_id" | "address" | "city" | "state" | "zip" | "skin" | "remote" | "status" | "role" | "department" | "accessmapid" | "ldap_server_status", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string | null
      password: string | null
      permissions: string | null
      activated: boolean
      created_by: number | null
      activation_code: string | null
      activated_at: Date | null
      last_login: Date | null
      persist_code: string | null
      reset_password_code: string | null
      first_name: string | null
      last_name: string | null
      created_at: Date | null
      updated_at: Date | null
      deleted_at: Date | null
      website: string | null
      country: string | null
      gravatar: string | null
      location_id: number | null
      phone: string | null
      jobtitle: string | null
      manager_id: number | null
      employee_num: string | null
      avatar: string | null
      username: string | null
      notes: string | null
      company_id: number | null
      remember_token: string | null
      ldap_import: boolean
      locale: string | null
      show_in_list: boolean
      two_factor_secret: string | null
      two_factor_enrolled: boolean
      two_factor_optin: boolean
      department_id: number | null
      address: string | null
      city: string | null
      state: string | null
      zip: string | null
      skin: string | null
      remote: number | null
      status: string | null
      role: string | null
      department: string | null
      accessmapid: string | null
      ldap_server_status: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly permissions: FieldRef<"User", 'String'>
    readonly activated: FieldRef<"User", 'Boolean'>
    readonly created_by: FieldRef<"User", 'Int'>
    readonly activation_code: FieldRef<"User", 'String'>
    readonly activated_at: FieldRef<"User", 'DateTime'>
    readonly last_login: FieldRef<"User", 'DateTime'>
    readonly persist_code: FieldRef<"User", 'String'>
    readonly reset_password_code: FieldRef<"User", 'String'>
    readonly first_name: FieldRef<"User", 'String'>
    readonly last_name: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
    readonly deleted_at: FieldRef<"User", 'DateTime'>
    readonly website: FieldRef<"User", 'String'>
    readonly country: FieldRef<"User", 'String'>
    readonly gravatar: FieldRef<"User", 'String'>
    readonly location_id: FieldRef<"User", 'Int'>
    readonly phone: FieldRef<"User", 'String'>
    readonly jobtitle: FieldRef<"User", 'String'>
    readonly manager_id: FieldRef<"User", 'Int'>
    readonly employee_num: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly notes: FieldRef<"User", 'String'>
    readonly company_id: FieldRef<"User", 'Int'>
    readonly remember_token: FieldRef<"User", 'String'>
    readonly ldap_import: FieldRef<"User", 'Boolean'>
    readonly locale: FieldRef<"User", 'String'>
    readonly show_in_list: FieldRef<"User", 'Boolean'>
    readonly two_factor_secret: FieldRef<"User", 'String'>
    readonly two_factor_enrolled: FieldRef<"User", 'Boolean'>
    readonly two_factor_optin: FieldRef<"User", 'Boolean'>
    readonly department_id: FieldRef<"User", 'Int'>
    readonly address: FieldRef<"User", 'String'>
    readonly city: FieldRef<"User", 'String'>
    readonly state: FieldRef<"User", 'String'>
    readonly zip: FieldRef<"User", 'String'>
    readonly skin: FieldRef<"User", 'String'>
    readonly remote: FieldRef<"User", 'Int'>
    readonly status: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly department: FieldRef<"User", 'String'>
    readonly accessmapid: FieldRef<"User", 'String'>
    readonly ldap_server_status: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model Queue
   */

  export type AggregateQueue = {
    _count: QueueCountAggregateOutputType | null
    _avg: QueueAvgAggregateOutputType | null
    _sum: QueueSumAggregateOutputType | null
    _min: QueueMinAggregateOutputType | null
    _max: QueueMaxAggregateOutputType | null
  }

  export type QueueAvgAggregateOutputType = {
    id: number | null
    antedatequeueid: number | null
    antedatestatus: number | null
    idpatient: number | null
    agepatient: number | null
    status: number | null
  }

  export type QueueSumAggregateOutputType = {
    id: bigint | null
    antedatequeueid: bigint | null
    antedatestatus: number | null
    idpatient: bigint | null
    agepatient: number | null
    status: number | null
  }

  export type QueueMinAggregateOutputType = {
    id: bigint | null
    idbu: string | null
    code: string | null
    Date: Date | null
    antedatequeueid: bigint | null
    antedate: Date | null
    antedatecode: string | null
    antedatetime: Date | null
    antedatestatus: number | null
    antedatereason: string | null
    antedateapprovedby: string | null
    antedateapproveddate: Date | null
    datetime: Date | null
    idpatient: bigint | null
    qfullname: string | null
    qlastname: string | null
    qfirstname: string | null
    qmiddlename: string | null
    qgender: string | null
    qdob: Date | null
    qfulladdress: string | null
    agepatient: number | null
    status: number | null
    accessionno: string | null
    notes: string | null
    cancelreason: string | null
    patienttype: string | null
    picture: string | null
    inputby: string | null
    lab2labid: string | null
    labbarcode: string | null
    labid: string | null
    updatedate: Date | null
    updateby: string | null
    erosstatus: string | null
    systemupdatetime: Date | null
  }

  export type QueueMaxAggregateOutputType = {
    id: bigint | null
    idbu: string | null
    code: string | null
    Date: Date | null
    antedatequeueid: bigint | null
    antedate: Date | null
    antedatecode: string | null
    antedatetime: Date | null
    antedatestatus: number | null
    antedatereason: string | null
    antedateapprovedby: string | null
    antedateapproveddate: Date | null
    datetime: Date | null
    idpatient: bigint | null
    qfullname: string | null
    qlastname: string | null
    qfirstname: string | null
    qmiddlename: string | null
    qgender: string | null
    qdob: Date | null
    qfulladdress: string | null
    agepatient: number | null
    status: number | null
    accessionno: string | null
    notes: string | null
    cancelreason: string | null
    patienttype: string | null
    picture: string | null
    inputby: string | null
    lab2labid: string | null
    labbarcode: string | null
    labid: string | null
    updatedate: Date | null
    updateby: string | null
    erosstatus: string | null
    systemupdatetime: Date | null
  }

  export type QueueCountAggregateOutputType = {
    id: number
    idbu: number
    code: number
    Date: number
    antedatequeueid: number
    antedate: number
    antedatecode: number
    antedatetime: number
    antedatestatus: number
    antedatereason: number
    antedateapprovedby: number
    antedateapproveddate: number
    datetime: number
    idpatient: number
    qfullname: number
    qlastname: number
    qfirstname: number
    qmiddlename: number
    qgender: number
    qdob: number
    qfulladdress: number
    agepatient: number
    status: number
    accessionno: number
    notes: number
    cancelreason: number
    patienttype: number
    picture: number
    inputby: number
    lab2labid: number
    labbarcode: number
    labid: number
    updatedate: number
    updateby: number
    erosstatus: number
    systemupdatetime: number
    _all: number
  }


  export type QueueAvgAggregateInputType = {
    id?: true
    antedatequeueid?: true
    antedatestatus?: true
    idpatient?: true
    agepatient?: true
    status?: true
  }

  export type QueueSumAggregateInputType = {
    id?: true
    antedatequeueid?: true
    antedatestatus?: true
    idpatient?: true
    agepatient?: true
    status?: true
  }

  export type QueueMinAggregateInputType = {
    id?: true
    idbu?: true
    code?: true
    Date?: true
    antedatequeueid?: true
    antedate?: true
    antedatecode?: true
    antedatetime?: true
    antedatestatus?: true
    antedatereason?: true
    antedateapprovedby?: true
    antedateapproveddate?: true
    datetime?: true
    idpatient?: true
    qfullname?: true
    qlastname?: true
    qfirstname?: true
    qmiddlename?: true
    qgender?: true
    qdob?: true
    qfulladdress?: true
    agepatient?: true
    status?: true
    accessionno?: true
    notes?: true
    cancelreason?: true
    patienttype?: true
    picture?: true
    inputby?: true
    lab2labid?: true
    labbarcode?: true
    labid?: true
    updatedate?: true
    updateby?: true
    erosstatus?: true
    systemupdatetime?: true
  }

  export type QueueMaxAggregateInputType = {
    id?: true
    idbu?: true
    code?: true
    Date?: true
    antedatequeueid?: true
    antedate?: true
    antedatecode?: true
    antedatetime?: true
    antedatestatus?: true
    antedatereason?: true
    antedateapprovedby?: true
    antedateapproveddate?: true
    datetime?: true
    idpatient?: true
    qfullname?: true
    qlastname?: true
    qfirstname?: true
    qmiddlename?: true
    qgender?: true
    qdob?: true
    qfulladdress?: true
    agepatient?: true
    status?: true
    accessionno?: true
    notes?: true
    cancelreason?: true
    patienttype?: true
    picture?: true
    inputby?: true
    lab2labid?: true
    labbarcode?: true
    labid?: true
    updatedate?: true
    updateby?: true
    erosstatus?: true
    systemupdatetime?: true
  }

  export type QueueCountAggregateInputType = {
    id?: true
    idbu?: true
    code?: true
    Date?: true
    antedatequeueid?: true
    antedate?: true
    antedatecode?: true
    antedatetime?: true
    antedatestatus?: true
    antedatereason?: true
    antedateapprovedby?: true
    antedateapproveddate?: true
    datetime?: true
    idpatient?: true
    qfullname?: true
    qlastname?: true
    qfirstname?: true
    qmiddlename?: true
    qgender?: true
    qdob?: true
    qfulladdress?: true
    agepatient?: true
    status?: true
    accessionno?: true
    notes?: true
    cancelreason?: true
    patienttype?: true
    picture?: true
    inputby?: true
    lab2labid?: true
    labbarcode?: true
    labid?: true
    updatedate?: true
    updateby?: true
    erosstatus?: true
    systemupdatetime?: true
    _all?: true
  }

  export type QueueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Queue to aggregate.
     */
    where?: QueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Queues to fetch.
     */
    orderBy?: QueueOrderByWithRelationInput | QueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: QueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Queues
    **/
    _count?: true | QueueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: QueueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: QueueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: QueueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: QueueMaxAggregateInputType
  }

  export type GetQueueAggregateType<T extends QueueAggregateArgs> = {
        [P in keyof T & keyof AggregateQueue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateQueue[P]>
      : GetScalarType<T[P], AggregateQueue[P]>
  }




  export type QueueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QueueWhereInput
    orderBy?: QueueOrderByWithAggregationInput | QueueOrderByWithAggregationInput[]
    by: QueueScalarFieldEnum[] | QueueScalarFieldEnum
    having?: QueueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: QueueCountAggregateInputType | true
    _avg?: QueueAvgAggregateInputType
    _sum?: QueueSumAggregateInputType
    _min?: QueueMinAggregateInputType
    _max?: QueueMaxAggregateInputType
  }

  export type QueueGroupByOutputType = {
    id: bigint
    idbu: string | null
    code: string | null
    Date: Date
    antedatequeueid: bigint | null
    antedate: Date | null
    antedatecode: string | null
    antedatetime: Date | null
    antedatestatus: number
    antedatereason: string | null
    antedateapprovedby: string | null
    antedateapproveddate: Date | null
    datetime: Date
    idpatient: bigint
    qfullname: string | null
    qlastname: string | null
    qfirstname: string | null
    qmiddlename: string | null
    qgender: string | null
    qdob: Date | null
    qfulladdress: string | null
    agepatient: number | null
    status: number
    accessionno: string | null
    notes: string | null
    cancelreason: string | null
    patienttype: string | null
    picture: string | null
    inputby: string | null
    lab2labid: string | null
    labbarcode: string | null
    labid: string | null
    updatedate: Date | null
    updateby: string | null
    erosstatus: string | null
    systemupdatetime: Date | null
    _count: QueueCountAggregateOutputType | null
    _avg: QueueAvgAggregateOutputType | null
    _sum: QueueSumAggregateOutputType | null
    _min: QueueMinAggregateOutputType | null
    _max: QueueMaxAggregateOutputType | null
  }

  type GetQueueGroupByPayload<T extends QueueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<QueueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof QueueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], QueueGroupByOutputType[P]>
            : GetScalarType<T[P], QueueGroupByOutputType[P]>
        }
      >
    >


  export type QueueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idbu?: boolean
    code?: boolean
    Date?: boolean
    antedatequeueid?: boolean
    antedate?: boolean
    antedatecode?: boolean
    antedatetime?: boolean
    antedatestatus?: boolean
    antedatereason?: boolean
    antedateapprovedby?: boolean
    antedateapproveddate?: boolean
    datetime?: boolean
    idpatient?: boolean
    qfullname?: boolean
    qlastname?: boolean
    qfirstname?: boolean
    qmiddlename?: boolean
    qgender?: boolean
    qdob?: boolean
    qfulladdress?: boolean
    agepatient?: boolean
    status?: boolean
    accessionno?: boolean
    notes?: boolean
    cancelreason?: boolean
    patienttype?: boolean
    picture?: boolean
    inputby?: boolean
    lab2labid?: boolean
    labbarcode?: boolean
    labid?: boolean
    updatedate?: boolean
    updateby?: boolean
    erosstatus?: boolean
    systemupdatetime?: boolean
  }, ExtArgs["result"]["queue"]>

  export type QueueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idbu?: boolean
    code?: boolean
    Date?: boolean
    antedatequeueid?: boolean
    antedate?: boolean
    antedatecode?: boolean
    antedatetime?: boolean
    antedatestatus?: boolean
    antedatereason?: boolean
    antedateapprovedby?: boolean
    antedateapproveddate?: boolean
    datetime?: boolean
    idpatient?: boolean
    qfullname?: boolean
    qlastname?: boolean
    qfirstname?: boolean
    qmiddlename?: boolean
    qgender?: boolean
    qdob?: boolean
    qfulladdress?: boolean
    agepatient?: boolean
    status?: boolean
    accessionno?: boolean
    notes?: boolean
    cancelreason?: boolean
    patienttype?: boolean
    picture?: boolean
    inputby?: boolean
    lab2labid?: boolean
    labbarcode?: boolean
    labid?: boolean
    updatedate?: boolean
    updateby?: boolean
    erosstatus?: boolean
    systemupdatetime?: boolean
  }, ExtArgs["result"]["queue"]>

  export type QueueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idbu?: boolean
    code?: boolean
    Date?: boolean
    antedatequeueid?: boolean
    antedate?: boolean
    antedatecode?: boolean
    antedatetime?: boolean
    antedatestatus?: boolean
    antedatereason?: boolean
    antedateapprovedby?: boolean
    antedateapproveddate?: boolean
    datetime?: boolean
    idpatient?: boolean
    qfullname?: boolean
    qlastname?: boolean
    qfirstname?: boolean
    qmiddlename?: boolean
    qgender?: boolean
    qdob?: boolean
    qfulladdress?: boolean
    agepatient?: boolean
    status?: boolean
    accessionno?: boolean
    notes?: boolean
    cancelreason?: boolean
    patienttype?: boolean
    picture?: boolean
    inputby?: boolean
    lab2labid?: boolean
    labbarcode?: boolean
    labid?: boolean
    updatedate?: boolean
    updateby?: boolean
    erosstatus?: boolean
    systemupdatetime?: boolean
  }, ExtArgs["result"]["queue"]>

  export type QueueSelectScalar = {
    id?: boolean
    idbu?: boolean
    code?: boolean
    Date?: boolean
    antedatequeueid?: boolean
    antedate?: boolean
    antedatecode?: boolean
    antedatetime?: boolean
    antedatestatus?: boolean
    antedatereason?: boolean
    antedateapprovedby?: boolean
    antedateapproveddate?: boolean
    datetime?: boolean
    idpatient?: boolean
    qfullname?: boolean
    qlastname?: boolean
    qfirstname?: boolean
    qmiddlename?: boolean
    qgender?: boolean
    qdob?: boolean
    qfulladdress?: boolean
    agepatient?: boolean
    status?: boolean
    accessionno?: boolean
    notes?: boolean
    cancelreason?: boolean
    patienttype?: boolean
    picture?: boolean
    inputby?: boolean
    lab2labid?: boolean
    labbarcode?: boolean
    labid?: boolean
    updatedate?: boolean
    updateby?: boolean
    erosstatus?: boolean
    systemupdatetime?: boolean
  }

  export type QueueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "idbu" | "code" | "Date" | "antedatequeueid" | "antedate" | "antedatecode" | "antedatetime" | "antedatestatus" | "antedatereason" | "antedateapprovedby" | "antedateapproveddate" | "datetime" | "idpatient" | "qfullname" | "qlastname" | "qfirstname" | "qmiddlename" | "qgender" | "qdob" | "qfulladdress" | "agepatient" | "status" | "accessionno" | "notes" | "cancelreason" | "patienttype" | "picture" | "inputby" | "lab2labid" | "labbarcode" | "labid" | "updatedate" | "updateby" | "erosstatus" | "systemupdatetime", ExtArgs["result"]["queue"]>

  export type $QueuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Queue"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      idbu: string | null
      code: string | null
      Date: Date
      antedatequeueid: bigint | null
      antedate: Date | null
      antedatecode: string | null
      antedatetime: Date | null
      antedatestatus: number
      antedatereason: string | null
      antedateapprovedby: string | null
      antedateapproveddate: Date | null
      datetime: Date
      idpatient: bigint
      qfullname: string | null
      qlastname: string | null
      qfirstname: string | null
      qmiddlename: string | null
      qgender: string | null
      qdob: Date | null
      qfulladdress: string | null
      agepatient: number | null
      status: number
      accessionno: string | null
      notes: string | null
      cancelreason: string | null
      patienttype: string | null
      picture: string | null
      inputby: string | null
      lab2labid: string | null
      labbarcode: string | null
      labid: string | null
      updatedate: Date | null
      updateby: string | null
      erosstatus: string | null
      systemupdatetime: Date | null
    }, ExtArgs["result"]["queue"]>
    composites: {}
  }

  type QueueGetPayload<S extends boolean | null | undefined | QueueDefaultArgs> = $Result.GetResult<Prisma.$QueuePayload, S>

  type QueueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<QueueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: QueueCountAggregateInputType | true
    }

  export interface QueueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Queue'], meta: { name: 'Queue' } }
    /**
     * Find zero or one Queue that matches the filter.
     * @param {QueueFindUniqueArgs} args - Arguments to find a Queue
     * @example
     * // Get one Queue
     * const queue = await prisma.queue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends QueueFindUniqueArgs>(args: SelectSubset<T, QueueFindUniqueArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Queue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {QueueFindUniqueOrThrowArgs} args - Arguments to find a Queue
     * @example
     * // Get one Queue
     * const queue = await prisma.queue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends QueueFindUniqueOrThrowArgs>(args: SelectSubset<T, QueueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Queue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueFindFirstArgs} args - Arguments to find a Queue
     * @example
     * // Get one Queue
     * const queue = await prisma.queue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends QueueFindFirstArgs>(args?: SelectSubset<T, QueueFindFirstArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Queue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueFindFirstOrThrowArgs} args - Arguments to find a Queue
     * @example
     * // Get one Queue
     * const queue = await prisma.queue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends QueueFindFirstOrThrowArgs>(args?: SelectSubset<T, QueueFindFirstOrThrowArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Queues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Queues
     * const queues = await prisma.queue.findMany()
     * 
     * // Get first 10 Queues
     * const queues = await prisma.queue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const queueWithIdOnly = await prisma.queue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends QueueFindManyArgs>(args?: SelectSubset<T, QueueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Queue.
     * @param {QueueCreateArgs} args - Arguments to create a Queue.
     * @example
     * // Create one Queue
     * const Queue = await prisma.queue.create({
     *   data: {
     *     // ... data to create a Queue
     *   }
     * })
     * 
     */
    create<T extends QueueCreateArgs>(args: SelectSubset<T, QueueCreateArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Queues.
     * @param {QueueCreateManyArgs} args - Arguments to create many Queues.
     * @example
     * // Create many Queues
     * const queue = await prisma.queue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends QueueCreateManyArgs>(args?: SelectSubset<T, QueueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Queues and returns the data saved in the database.
     * @param {QueueCreateManyAndReturnArgs} args - Arguments to create many Queues.
     * @example
     * // Create many Queues
     * const queue = await prisma.queue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Queues and only return the `id`
     * const queueWithIdOnly = await prisma.queue.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends QueueCreateManyAndReturnArgs>(args?: SelectSubset<T, QueueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Queue.
     * @param {QueueDeleteArgs} args - Arguments to delete one Queue.
     * @example
     * // Delete one Queue
     * const Queue = await prisma.queue.delete({
     *   where: {
     *     // ... filter to delete one Queue
     *   }
     * })
     * 
     */
    delete<T extends QueueDeleteArgs>(args: SelectSubset<T, QueueDeleteArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Queue.
     * @param {QueueUpdateArgs} args - Arguments to update one Queue.
     * @example
     * // Update one Queue
     * const queue = await prisma.queue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends QueueUpdateArgs>(args: SelectSubset<T, QueueUpdateArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Queues.
     * @param {QueueDeleteManyArgs} args - Arguments to filter Queues to delete.
     * @example
     * // Delete a few Queues
     * const { count } = await prisma.queue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends QueueDeleteManyArgs>(args?: SelectSubset<T, QueueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Queues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Queues
     * const queue = await prisma.queue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends QueueUpdateManyArgs>(args: SelectSubset<T, QueueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Queues and returns the data updated in the database.
     * @param {QueueUpdateManyAndReturnArgs} args - Arguments to update many Queues.
     * @example
     * // Update many Queues
     * const queue = await prisma.queue.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Queues and only return the `id`
     * const queueWithIdOnly = await prisma.queue.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends QueueUpdateManyAndReturnArgs>(args: SelectSubset<T, QueueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Queue.
     * @param {QueueUpsertArgs} args - Arguments to update or create a Queue.
     * @example
     * // Update or create a Queue
     * const queue = await prisma.queue.upsert({
     *   create: {
     *     // ... data to create a Queue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Queue we want to update
     *   }
     * })
     */
    upsert<T extends QueueUpsertArgs>(args: SelectSubset<T, QueueUpsertArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Queues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueCountArgs} args - Arguments to filter Queues to count.
     * @example
     * // Count the number of Queues
     * const count = await prisma.queue.count({
     *   where: {
     *     // ... the filter for the Queues we want to count
     *   }
     * })
    **/
    count<T extends QueueCountArgs>(
      args?: Subset<T, QueueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], QueueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Queue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends QueueAggregateArgs>(args: Subset<T, QueueAggregateArgs>): Prisma.PrismaPromise<GetQueueAggregateType<T>>

    /**
     * Group by Queue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {QueueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends QueueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: QueueGroupByArgs['orderBy'] }
        : { orderBy?: QueueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, QueueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetQueueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Queue model
   */
  readonly fields: QueueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Queue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__QueueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Queue model
   */
  interface QueueFieldRefs {
    readonly id: FieldRef<"Queue", 'BigInt'>
    readonly idbu: FieldRef<"Queue", 'String'>
    readonly code: FieldRef<"Queue", 'String'>
    readonly Date: FieldRef<"Queue", 'DateTime'>
    readonly antedatequeueid: FieldRef<"Queue", 'BigInt'>
    readonly antedate: FieldRef<"Queue", 'DateTime'>
    readonly antedatecode: FieldRef<"Queue", 'String'>
    readonly antedatetime: FieldRef<"Queue", 'DateTime'>
    readonly antedatestatus: FieldRef<"Queue", 'Int'>
    readonly antedatereason: FieldRef<"Queue", 'String'>
    readonly antedateapprovedby: FieldRef<"Queue", 'String'>
    readonly antedateapproveddate: FieldRef<"Queue", 'DateTime'>
    readonly datetime: FieldRef<"Queue", 'DateTime'>
    readonly idpatient: FieldRef<"Queue", 'BigInt'>
    readonly qfullname: FieldRef<"Queue", 'String'>
    readonly qlastname: FieldRef<"Queue", 'String'>
    readonly qfirstname: FieldRef<"Queue", 'String'>
    readonly qmiddlename: FieldRef<"Queue", 'String'>
    readonly qgender: FieldRef<"Queue", 'String'>
    readonly qdob: FieldRef<"Queue", 'DateTime'>
    readonly qfulladdress: FieldRef<"Queue", 'String'>
    readonly agepatient: FieldRef<"Queue", 'Int'>
    readonly status: FieldRef<"Queue", 'Int'>
    readonly accessionno: FieldRef<"Queue", 'String'>
    readonly notes: FieldRef<"Queue", 'String'>
    readonly cancelreason: FieldRef<"Queue", 'String'>
    readonly patienttype: FieldRef<"Queue", 'String'>
    readonly picture: FieldRef<"Queue", 'String'>
    readonly inputby: FieldRef<"Queue", 'String'>
    readonly lab2labid: FieldRef<"Queue", 'String'>
    readonly labbarcode: FieldRef<"Queue", 'String'>
    readonly labid: FieldRef<"Queue", 'String'>
    readonly updatedate: FieldRef<"Queue", 'DateTime'>
    readonly updateby: FieldRef<"Queue", 'String'>
    readonly erosstatus: FieldRef<"Queue", 'String'>
    readonly systemupdatetime: FieldRef<"Queue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Queue findUnique
   */
  export type QueueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * Filter, which Queue to fetch.
     */
    where: QueueWhereUniqueInput
  }

  /**
   * Queue findUniqueOrThrow
   */
  export type QueueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * Filter, which Queue to fetch.
     */
    where: QueueWhereUniqueInput
  }

  /**
   * Queue findFirst
   */
  export type QueueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * Filter, which Queue to fetch.
     */
    where?: QueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Queues to fetch.
     */
    orderBy?: QueueOrderByWithRelationInput | QueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Queues.
     */
    cursor?: QueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Queues.
     */
    distinct?: QueueScalarFieldEnum | QueueScalarFieldEnum[]
  }

  /**
   * Queue findFirstOrThrow
   */
  export type QueueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * Filter, which Queue to fetch.
     */
    where?: QueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Queues to fetch.
     */
    orderBy?: QueueOrderByWithRelationInput | QueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Queues.
     */
    cursor?: QueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Queues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Queues.
     */
    distinct?: QueueScalarFieldEnum | QueueScalarFieldEnum[]
  }

  /**
   * Queue findMany
   */
  export type QueueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * Filter, which Queues to fetch.
     */
    where?: QueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Queues to fetch.
     */
    orderBy?: QueueOrderByWithRelationInput | QueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Queues.
     */
    cursor?: QueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Queues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Queues.
     */
    skip?: number
    distinct?: QueueScalarFieldEnum | QueueScalarFieldEnum[]
  }

  /**
   * Queue create
   */
  export type QueueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * The data needed to create a Queue.
     */
    data: XOR<QueueCreateInput, QueueUncheckedCreateInput>
  }

  /**
   * Queue createMany
   */
  export type QueueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Queues.
     */
    data: QueueCreateManyInput | QueueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Queue createManyAndReturn
   */
  export type QueueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * The data used to create many Queues.
     */
    data: QueueCreateManyInput | QueueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Queue update
   */
  export type QueueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * The data needed to update a Queue.
     */
    data: XOR<QueueUpdateInput, QueueUncheckedUpdateInput>
    /**
     * Choose, which Queue to update.
     */
    where: QueueWhereUniqueInput
  }

  /**
   * Queue updateMany
   */
  export type QueueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Queues.
     */
    data: XOR<QueueUpdateManyMutationInput, QueueUncheckedUpdateManyInput>
    /**
     * Filter which Queues to update
     */
    where?: QueueWhereInput
    /**
     * Limit how many Queues to update.
     */
    limit?: number
  }

  /**
   * Queue updateManyAndReturn
   */
  export type QueueUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * The data used to update Queues.
     */
    data: XOR<QueueUpdateManyMutationInput, QueueUncheckedUpdateManyInput>
    /**
     * Filter which Queues to update
     */
    where?: QueueWhereInput
    /**
     * Limit how many Queues to update.
     */
    limit?: number
  }

  /**
   * Queue upsert
   */
  export type QueueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * The filter to search for the Queue to update in case it exists.
     */
    where: QueueWhereUniqueInput
    /**
     * In case the Queue found by the `where` argument doesn't exist, create a new Queue with this data.
     */
    create: XOR<QueueCreateInput, QueueUncheckedCreateInput>
    /**
     * In case the Queue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<QueueUpdateInput, QueueUncheckedUpdateInput>
  }

  /**
   * Queue delete
   */
  export type QueueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * Filter which Queue to delete.
     */
    where: QueueWhereUniqueInput
  }

  /**
   * Queue deleteMany
   */
  export type QueueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Queues to delete
     */
    where?: QueueWhereInput
    /**
     * Limit how many Queues to delete.
     */
    limit?: number
  }

  /**
   * Queue without action
   */
  export type QueueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
  }


  /**
   * Model CmsVitals
   */

  export type AggregateCmsVitals = {
    _count: CmsVitalsCountAggregateOutputType | null
    _avg: CmsVitalsAvgAggregateOutputType | null
    _sum: CmsVitalsSumAggregateOutputType | null
    _min: CmsVitalsMinAggregateOutputType | null
    _max: CmsVitalsMaxAggregateOutputType | null
  }

  export type CmsVitalsAvgAggregateOutputType = {
    id: number | null
    idqueue: number | null
  }

  export type CmsVitalsSumAggregateOutputType = {
    id: bigint | null
    idqueue: bigint | null
  }

  export type CmsVitalsMinAggregateOutputType = {
    id: bigint | null
    idqueue: bigint | null
    medication: string | null
    lastdose: Date | null
    lastperiod: Date | null
    inputby: string | null
    inputdatetime: Date | null
  }

  export type CmsVitalsMaxAggregateOutputType = {
    id: bigint | null
    idqueue: bigint | null
    medication: string | null
    lastdose: Date | null
    lastperiod: Date | null
    inputby: string | null
    inputdatetime: Date | null
  }

  export type CmsVitalsCountAggregateOutputType = {
    id: number
    idqueue: number
    medication: number
    lastdose: number
    lastperiod: number
    inputby: number
    inputdatetime: number
    _all: number
  }


  export type CmsVitalsAvgAggregateInputType = {
    id?: true
    idqueue?: true
  }

  export type CmsVitalsSumAggregateInputType = {
    id?: true
    idqueue?: true
  }

  export type CmsVitalsMinAggregateInputType = {
    id?: true
    idqueue?: true
    medication?: true
    lastdose?: true
    lastperiod?: true
    inputby?: true
    inputdatetime?: true
  }

  export type CmsVitalsMaxAggregateInputType = {
    id?: true
    idqueue?: true
    medication?: true
    lastdose?: true
    lastperiod?: true
    inputby?: true
    inputdatetime?: true
  }

  export type CmsVitalsCountAggregateInputType = {
    id?: true
    idqueue?: true
    medication?: true
    lastdose?: true
    lastperiod?: true
    inputby?: true
    inputdatetime?: true
    _all?: true
  }

  export type CmsVitalsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CmsVitals to aggregate.
     */
    where?: CmsVitalsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CmsVitals to fetch.
     */
    orderBy?: CmsVitalsOrderByWithRelationInput | CmsVitalsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CmsVitalsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CmsVitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CmsVitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CmsVitals
    **/
    _count?: true | CmsVitalsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CmsVitalsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CmsVitalsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CmsVitalsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CmsVitalsMaxAggregateInputType
  }

  export type GetCmsVitalsAggregateType<T extends CmsVitalsAggregateArgs> = {
        [P in keyof T & keyof AggregateCmsVitals]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCmsVitals[P]>
      : GetScalarType<T[P], AggregateCmsVitals[P]>
  }




  export type CmsVitalsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CmsVitalsWhereInput
    orderBy?: CmsVitalsOrderByWithAggregationInput | CmsVitalsOrderByWithAggregationInput[]
    by: CmsVitalsScalarFieldEnum[] | CmsVitalsScalarFieldEnum
    having?: CmsVitalsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CmsVitalsCountAggregateInputType | true
    _avg?: CmsVitalsAvgAggregateInputType
    _sum?: CmsVitalsSumAggregateInputType
    _min?: CmsVitalsMinAggregateInputType
    _max?: CmsVitalsMaxAggregateInputType
  }

  export type CmsVitalsGroupByOutputType = {
    id: bigint
    idqueue: bigint
    medication: string | null
    lastdose: Date | null
    lastperiod: Date | null
    inputby: string | null
    inputdatetime: Date | null
    _count: CmsVitalsCountAggregateOutputType | null
    _avg: CmsVitalsAvgAggregateOutputType | null
    _sum: CmsVitalsSumAggregateOutputType | null
    _min: CmsVitalsMinAggregateOutputType | null
    _max: CmsVitalsMaxAggregateOutputType | null
  }

  type GetCmsVitalsGroupByPayload<T extends CmsVitalsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CmsVitalsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CmsVitalsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CmsVitalsGroupByOutputType[P]>
            : GetScalarType<T[P], CmsVitalsGroupByOutputType[P]>
        }
      >
    >


  export type CmsVitalsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idqueue?: boolean
    medication?: boolean
    lastdose?: boolean
    lastperiod?: boolean
    inputby?: boolean
    inputdatetime?: boolean
  }, ExtArgs["result"]["cmsVitals"]>

  export type CmsVitalsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idqueue?: boolean
    medication?: boolean
    lastdose?: boolean
    lastperiod?: boolean
    inputby?: boolean
    inputdatetime?: boolean
  }, ExtArgs["result"]["cmsVitals"]>

  export type CmsVitalsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    idqueue?: boolean
    medication?: boolean
    lastdose?: boolean
    lastperiod?: boolean
    inputby?: boolean
    inputdatetime?: boolean
  }, ExtArgs["result"]["cmsVitals"]>

  export type CmsVitalsSelectScalar = {
    id?: boolean
    idqueue?: boolean
    medication?: boolean
    lastdose?: boolean
    lastperiod?: boolean
    inputby?: boolean
    inputdatetime?: boolean
  }

  export type CmsVitalsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "idqueue" | "medication" | "lastdose" | "lastperiod" | "inputby" | "inputdatetime", ExtArgs["result"]["cmsVitals"]>

  export type $CmsVitalsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CmsVitals"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      idqueue: bigint
      medication: string | null
      lastdose: Date | null
      lastperiod: Date | null
      inputby: string | null
      inputdatetime: Date | null
    }, ExtArgs["result"]["cmsVitals"]>
    composites: {}
  }

  type CmsVitalsGetPayload<S extends boolean | null | undefined | CmsVitalsDefaultArgs> = $Result.GetResult<Prisma.$CmsVitalsPayload, S>

  type CmsVitalsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CmsVitalsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CmsVitalsCountAggregateInputType | true
    }

  export interface CmsVitalsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CmsVitals'], meta: { name: 'CmsVitals' } }
    /**
     * Find zero or one CmsVitals that matches the filter.
     * @param {CmsVitalsFindUniqueArgs} args - Arguments to find a CmsVitals
     * @example
     * // Get one CmsVitals
     * const cmsVitals = await prisma.cmsVitals.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CmsVitalsFindUniqueArgs>(args: SelectSubset<T, CmsVitalsFindUniqueArgs<ExtArgs>>): Prisma__CmsVitalsClient<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CmsVitals that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CmsVitalsFindUniqueOrThrowArgs} args - Arguments to find a CmsVitals
     * @example
     * // Get one CmsVitals
     * const cmsVitals = await prisma.cmsVitals.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CmsVitalsFindUniqueOrThrowArgs>(args: SelectSubset<T, CmsVitalsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CmsVitalsClient<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CmsVitals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsVitalsFindFirstArgs} args - Arguments to find a CmsVitals
     * @example
     * // Get one CmsVitals
     * const cmsVitals = await prisma.cmsVitals.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CmsVitalsFindFirstArgs>(args?: SelectSubset<T, CmsVitalsFindFirstArgs<ExtArgs>>): Prisma__CmsVitalsClient<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CmsVitals that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsVitalsFindFirstOrThrowArgs} args - Arguments to find a CmsVitals
     * @example
     * // Get one CmsVitals
     * const cmsVitals = await prisma.cmsVitals.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CmsVitalsFindFirstOrThrowArgs>(args?: SelectSubset<T, CmsVitalsFindFirstOrThrowArgs<ExtArgs>>): Prisma__CmsVitalsClient<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CmsVitals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsVitalsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CmsVitals
     * const cmsVitals = await prisma.cmsVitals.findMany()
     * 
     * // Get first 10 CmsVitals
     * const cmsVitals = await prisma.cmsVitals.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cmsVitalsWithIdOnly = await prisma.cmsVitals.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CmsVitalsFindManyArgs>(args?: SelectSubset<T, CmsVitalsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CmsVitals.
     * @param {CmsVitalsCreateArgs} args - Arguments to create a CmsVitals.
     * @example
     * // Create one CmsVitals
     * const CmsVitals = await prisma.cmsVitals.create({
     *   data: {
     *     // ... data to create a CmsVitals
     *   }
     * })
     * 
     */
    create<T extends CmsVitalsCreateArgs>(args: SelectSubset<T, CmsVitalsCreateArgs<ExtArgs>>): Prisma__CmsVitalsClient<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CmsVitals.
     * @param {CmsVitalsCreateManyArgs} args - Arguments to create many CmsVitals.
     * @example
     * // Create many CmsVitals
     * const cmsVitals = await prisma.cmsVitals.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CmsVitalsCreateManyArgs>(args?: SelectSubset<T, CmsVitalsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CmsVitals and returns the data saved in the database.
     * @param {CmsVitalsCreateManyAndReturnArgs} args - Arguments to create many CmsVitals.
     * @example
     * // Create many CmsVitals
     * const cmsVitals = await prisma.cmsVitals.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CmsVitals and only return the `id`
     * const cmsVitalsWithIdOnly = await prisma.cmsVitals.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CmsVitalsCreateManyAndReturnArgs>(args?: SelectSubset<T, CmsVitalsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CmsVitals.
     * @param {CmsVitalsDeleteArgs} args - Arguments to delete one CmsVitals.
     * @example
     * // Delete one CmsVitals
     * const CmsVitals = await prisma.cmsVitals.delete({
     *   where: {
     *     // ... filter to delete one CmsVitals
     *   }
     * })
     * 
     */
    delete<T extends CmsVitalsDeleteArgs>(args: SelectSubset<T, CmsVitalsDeleteArgs<ExtArgs>>): Prisma__CmsVitalsClient<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CmsVitals.
     * @param {CmsVitalsUpdateArgs} args - Arguments to update one CmsVitals.
     * @example
     * // Update one CmsVitals
     * const cmsVitals = await prisma.cmsVitals.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CmsVitalsUpdateArgs>(args: SelectSubset<T, CmsVitalsUpdateArgs<ExtArgs>>): Prisma__CmsVitalsClient<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CmsVitals.
     * @param {CmsVitalsDeleteManyArgs} args - Arguments to filter CmsVitals to delete.
     * @example
     * // Delete a few CmsVitals
     * const { count } = await prisma.cmsVitals.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CmsVitalsDeleteManyArgs>(args?: SelectSubset<T, CmsVitalsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CmsVitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsVitalsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CmsVitals
     * const cmsVitals = await prisma.cmsVitals.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CmsVitalsUpdateManyArgs>(args: SelectSubset<T, CmsVitalsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CmsVitals and returns the data updated in the database.
     * @param {CmsVitalsUpdateManyAndReturnArgs} args - Arguments to update many CmsVitals.
     * @example
     * // Update many CmsVitals
     * const cmsVitals = await prisma.cmsVitals.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CmsVitals and only return the `id`
     * const cmsVitalsWithIdOnly = await prisma.cmsVitals.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CmsVitalsUpdateManyAndReturnArgs>(args: SelectSubset<T, CmsVitalsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CmsVitals.
     * @param {CmsVitalsUpsertArgs} args - Arguments to update or create a CmsVitals.
     * @example
     * // Update or create a CmsVitals
     * const cmsVitals = await prisma.cmsVitals.upsert({
     *   create: {
     *     // ... data to create a CmsVitals
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CmsVitals we want to update
     *   }
     * })
     */
    upsert<T extends CmsVitalsUpsertArgs>(args: SelectSubset<T, CmsVitalsUpsertArgs<ExtArgs>>): Prisma__CmsVitalsClient<$Result.GetResult<Prisma.$CmsVitalsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CmsVitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsVitalsCountArgs} args - Arguments to filter CmsVitals to count.
     * @example
     * // Count the number of CmsVitals
     * const count = await prisma.cmsVitals.count({
     *   where: {
     *     // ... the filter for the CmsVitals we want to count
     *   }
     * })
    **/
    count<T extends CmsVitalsCountArgs>(
      args?: Subset<T, CmsVitalsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CmsVitalsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CmsVitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsVitalsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CmsVitalsAggregateArgs>(args: Subset<T, CmsVitalsAggregateArgs>): Prisma.PrismaPromise<GetCmsVitalsAggregateType<T>>

    /**
     * Group by CmsVitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsVitalsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CmsVitalsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CmsVitalsGroupByArgs['orderBy'] }
        : { orderBy?: CmsVitalsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CmsVitalsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCmsVitalsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CmsVitals model
   */
  readonly fields: CmsVitalsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CmsVitals.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CmsVitalsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CmsVitals model
   */
  interface CmsVitalsFieldRefs {
    readonly id: FieldRef<"CmsVitals", 'BigInt'>
    readonly idqueue: FieldRef<"CmsVitals", 'BigInt'>
    readonly medication: FieldRef<"CmsVitals", 'String'>
    readonly lastdose: FieldRef<"CmsVitals", 'DateTime'>
    readonly lastperiod: FieldRef<"CmsVitals", 'DateTime'>
    readonly inputby: FieldRef<"CmsVitals", 'String'>
    readonly inputdatetime: FieldRef<"CmsVitals", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CmsVitals findUnique
   */
  export type CmsVitalsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * Filter, which CmsVitals to fetch.
     */
    where: CmsVitalsWhereUniqueInput
  }

  /**
   * CmsVitals findUniqueOrThrow
   */
  export type CmsVitalsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * Filter, which CmsVitals to fetch.
     */
    where: CmsVitalsWhereUniqueInput
  }

  /**
   * CmsVitals findFirst
   */
  export type CmsVitalsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * Filter, which CmsVitals to fetch.
     */
    where?: CmsVitalsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CmsVitals to fetch.
     */
    orderBy?: CmsVitalsOrderByWithRelationInput | CmsVitalsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CmsVitals.
     */
    cursor?: CmsVitalsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CmsVitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CmsVitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CmsVitals.
     */
    distinct?: CmsVitalsScalarFieldEnum | CmsVitalsScalarFieldEnum[]
  }

  /**
   * CmsVitals findFirstOrThrow
   */
  export type CmsVitalsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * Filter, which CmsVitals to fetch.
     */
    where?: CmsVitalsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CmsVitals to fetch.
     */
    orderBy?: CmsVitalsOrderByWithRelationInput | CmsVitalsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CmsVitals.
     */
    cursor?: CmsVitalsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CmsVitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CmsVitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CmsVitals.
     */
    distinct?: CmsVitalsScalarFieldEnum | CmsVitalsScalarFieldEnum[]
  }

  /**
   * CmsVitals findMany
   */
  export type CmsVitalsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * Filter, which CmsVitals to fetch.
     */
    where?: CmsVitalsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CmsVitals to fetch.
     */
    orderBy?: CmsVitalsOrderByWithRelationInput | CmsVitalsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CmsVitals.
     */
    cursor?: CmsVitalsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CmsVitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CmsVitals.
     */
    skip?: number
    distinct?: CmsVitalsScalarFieldEnum | CmsVitalsScalarFieldEnum[]
  }

  /**
   * CmsVitals create
   */
  export type CmsVitalsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * The data needed to create a CmsVitals.
     */
    data: XOR<CmsVitalsCreateInput, CmsVitalsUncheckedCreateInput>
  }

  /**
   * CmsVitals createMany
   */
  export type CmsVitalsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CmsVitals.
     */
    data: CmsVitalsCreateManyInput | CmsVitalsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CmsVitals createManyAndReturn
   */
  export type CmsVitalsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * The data used to create many CmsVitals.
     */
    data: CmsVitalsCreateManyInput | CmsVitalsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CmsVitals update
   */
  export type CmsVitalsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * The data needed to update a CmsVitals.
     */
    data: XOR<CmsVitalsUpdateInput, CmsVitalsUncheckedUpdateInput>
    /**
     * Choose, which CmsVitals to update.
     */
    where: CmsVitalsWhereUniqueInput
  }

  /**
   * CmsVitals updateMany
   */
  export type CmsVitalsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CmsVitals.
     */
    data: XOR<CmsVitalsUpdateManyMutationInput, CmsVitalsUncheckedUpdateManyInput>
    /**
     * Filter which CmsVitals to update
     */
    where?: CmsVitalsWhereInput
    /**
     * Limit how many CmsVitals to update.
     */
    limit?: number
  }

  /**
   * CmsVitals updateManyAndReturn
   */
  export type CmsVitalsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * The data used to update CmsVitals.
     */
    data: XOR<CmsVitalsUpdateManyMutationInput, CmsVitalsUncheckedUpdateManyInput>
    /**
     * Filter which CmsVitals to update
     */
    where?: CmsVitalsWhereInput
    /**
     * Limit how many CmsVitals to update.
     */
    limit?: number
  }

  /**
   * CmsVitals upsert
   */
  export type CmsVitalsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * The filter to search for the CmsVitals to update in case it exists.
     */
    where: CmsVitalsWhereUniqueInput
    /**
     * In case the CmsVitals found by the `where` argument doesn't exist, create a new CmsVitals with this data.
     */
    create: XOR<CmsVitalsCreateInput, CmsVitalsUncheckedCreateInput>
    /**
     * In case the CmsVitals was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CmsVitalsUpdateInput, CmsVitalsUncheckedUpdateInput>
  }

  /**
   * CmsVitals delete
   */
  export type CmsVitalsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
    /**
     * Filter which CmsVitals to delete.
     */
    where: CmsVitalsWhereUniqueInput
  }

  /**
   * CmsVitals deleteMany
   */
  export type CmsVitalsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CmsVitals to delete
     */
    where?: CmsVitalsWhereInput
    /**
     * Limit how many CmsVitals to delete.
     */
    limit?: number
  }

  /**
   * CmsVitals without action
   */
  export type CmsVitalsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsVitals
     */
    select?: CmsVitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsVitals
     */
    omit?: CmsVitalsOmit<ExtArgs> | null
  }


  /**
   * Model Patient
   */

  export type AggregatePatient = {
    _count: PatientCountAggregateOutputType | null
    _avg: PatientAvgAggregateOutputType | null
    _sum: PatientSumAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  export type PatientAvgAggregateOutputType = {
    id: number | null
    isactive: number | null
  }

  export type PatientSumAggregateOutputType = {
    id: bigint | null
    isactive: number | null
  }

  export type PatientMinAggregateOutputType = {
    id: bigint | null
    code: string | null
    fullname: string | null
    lastname: string | null
    firstname: string | null
    middlename: string | null
    suffix: string | null
    prefix: string | null
    gender: string | null
    dob: Date | null
    email: string | null
    fulladdress: string | null
    address: string | null
    barangay: string | null
    barangayname: string | null
    city: string | null
    cityname: string | null
    state: string | null
    zipcode: string | null
    nationality: string | null
    country: string | null
    religion: string | null
    contactno: string | null
    moblie: string | null
    faxno: string | null
    philhealth: string | null
    seniorid: string | null
    pwd: string | null
    expirydatepwd: Date | null
    status: string | null
    isactive: number | null
    remarks: string | null
    picturelink: string | null
    uploadid: string | null
    inputdate: Date | null
    inputby: string | null
    updatedate: Date | null
    updateby: string | null
    lastvisit: Date | null
    passportno: string | null
    employeeid: string | null
    rdob: string | null
    uploaddatetime: Date | null
  }

  export type PatientMaxAggregateOutputType = {
    id: bigint | null
    code: string | null
    fullname: string | null
    lastname: string | null
    firstname: string | null
    middlename: string | null
    suffix: string | null
    prefix: string | null
    gender: string | null
    dob: Date | null
    email: string | null
    fulladdress: string | null
    address: string | null
    barangay: string | null
    barangayname: string | null
    city: string | null
    cityname: string | null
    state: string | null
    zipcode: string | null
    nationality: string | null
    country: string | null
    religion: string | null
    contactno: string | null
    moblie: string | null
    faxno: string | null
    philhealth: string | null
    seniorid: string | null
    pwd: string | null
    expirydatepwd: Date | null
    status: string | null
    isactive: number | null
    remarks: string | null
    picturelink: string | null
    uploadid: string | null
    inputdate: Date | null
    inputby: string | null
    updatedate: Date | null
    updateby: string | null
    lastvisit: Date | null
    passportno: string | null
    employeeid: string | null
    rdob: string | null
    uploaddatetime: Date | null
  }

  export type PatientCountAggregateOutputType = {
    id: number
    code: number
    fullname: number
    lastname: number
    firstname: number
    middlename: number
    suffix: number
    prefix: number
    gender: number
    dob: number
    email: number
    fulladdress: number
    address: number
    barangay: number
    barangayname: number
    city: number
    cityname: number
    state: number
    zipcode: number
    nationality: number
    country: number
    religion: number
    contactno: number
    moblie: number
    faxno: number
    philhealth: number
    seniorid: number
    pwd: number
    expirydatepwd: number
    status: number
    isactive: number
    remarks: number
    picturelink: number
    uploadid: number
    inputdate: number
    inputby: number
    updatedate: number
    updateby: number
    lastvisit: number
    passportno: number
    employeeid: number
    rdob: number
    uploaddatetime: number
    _all: number
  }


  export type PatientAvgAggregateInputType = {
    id?: true
    isactive?: true
  }

  export type PatientSumAggregateInputType = {
    id?: true
    isactive?: true
  }

  export type PatientMinAggregateInputType = {
    id?: true
    code?: true
    fullname?: true
    lastname?: true
    firstname?: true
    middlename?: true
    suffix?: true
    prefix?: true
    gender?: true
    dob?: true
    email?: true
    fulladdress?: true
    address?: true
    barangay?: true
    barangayname?: true
    city?: true
    cityname?: true
    state?: true
    zipcode?: true
    nationality?: true
    country?: true
    religion?: true
    contactno?: true
    moblie?: true
    faxno?: true
    philhealth?: true
    seniorid?: true
    pwd?: true
    expirydatepwd?: true
    status?: true
    isactive?: true
    remarks?: true
    picturelink?: true
    uploadid?: true
    inputdate?: true
    inputby?: true
    updatedate?: true
    updateby?: true
    lastvisit?: true
    passportno?: true
    employeeid?: true
    rdob?: true
    uploaddatetime?: true
  }

  export type PatientMaxAggregateInputType = {
    id?: true
    code?: true
    fullname?: true
    lastname?: true
    firstname?: true
    middlename?: true
    suffix?: true
    prefix?: true
    gender?: true
    dob?: true
    email?: true
    fulladdress?: true
    address?: true
    barangay?: true
    barangayname?: true
    city?: true
    cityname?: true
    state?: true
    zipcode?: true
    nationality?: true
    country?: true
    religion?: true
    contactno?: true
    moblie?: true
    faxno?: true
    philhealth?: true
    seniorid?: true
    pwd?: true
    expirydatepwd?: true
    status?: true
    isactive?: true
    remarks?: true
    picturelink?: true
    uploadid?: true
    inputdate?: true
    inputby?: true
    updatedate?: true
    updateby?: true
    lastvisit?: true
    passportno?: true
    employeeid?: true
    rdob?: true
    uploaddatetime?: true
  }

  export type PatientCountAggregateInputType = {
    id?: true
    code?: true
    fullname?: true
    lastname?: true
    firstname?: true
    middlename?: true
    suffix?: true
    prefix?: true
    gender?: true
    dob?: true
    email?: true
    fulladdress?: true
    address?: true
    barangay?: true
    barangayname?: true
    city?: true
    cityname?: true
    state?: true
    zipcode?: true
    nationality?: true
    country?: true
    religion?: true
    contactno?: true
    moblie?: true
    faxno?: true
    philhealth?: true
    seniorid?: true
    pwd?: true
    expirydatepwd?: true
    status?: true
    isactive?: true
    remarks?: true
    picturelink?: true
    uploadid?: true
    inputdate?: true
    inputby?: true
    updatedate?: true
    updateby?: true
    lastvisit?: true
    passportno?: true
    employeeid?: true
    rdob?: true
    uploaddatetime?: true
    _all?: true
  }

  export type PatientAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patient to aggregate.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Patients
    **/
    _count?: true | PatientCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PatientAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PatientSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PatientMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PatientMaxAggregateInputType
  }

  export type GetPatientAggregateType<T extends PatientAggregateArgs> = {
        [P in keyof T & keyof AggregatePatient]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePatient[P]>
      : GetScalarType<T[P], AggregatePatient[P]>
  }




  export type PatientGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PatientWhereInput
    orderBy?: PatientOrderByWithAggregationInput | PatientOrderByWithAggregationInput[]
    by: PatientScalarFieldEnum[] | PatientScalarFieldEnum
    having?: PatientScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PatientCountAggregateInputType | true
    _avg?: PatientAvgAggregateInputType
    _sum?: PatientSumAggregateInputType
    _min?: PatientMinAggregateInputType
    _max?: PatientMaxAggregateInputType
  }

  export type PatientGroupByOutputType = {
    id: bigint
    code: string | null
    fullname: string | null
    lastname: string | null
    firstname: string | null
    middlename: string | null
    suffix: string | null
    prefix: string | null
    gender: string | null
    dob: Date
    email: string | null
    fulladdress: string | null
    address: string | null
    barangay: string | null
    barangayname: string | null
    city: string | null
    cityname: string | null
    state: string | null
    zipcode: string | null
    nationality: string | null
    country: string | null
    religion: string | null
    contactno: string | null
    moblie: string | null
    faxno: string | null
    philhealth: string | null
    seniorid: string | null
    pwd: string | null
    expirydatepwd: Date | null
    status: string | null
    isactive: number
    remarks: string | null
    picturelink: string | null
    uploadid: string | null
    inputdate: Date | null
    inputby: string | null
    updatedate: Date | null
    updateby: string | null
    lastvisit: Date | null
    passportno: string | null
    employeeid: string | null
    rdob: string | null
    uploaddatetime: Date
    _count: PatientCountAggregateOutputType | null
    _avg: PatientAvgAggregateOutputType | null
    _sum: PatientSumAggregateOutputType | null
    _min: PatientMinAggregateOutputType | null
    _max: PatientMaxAggregateOutputType | null
  }

  type GetPatientGroupByPayload<T extends PatientGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PatientGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PatientGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PatientGroupByOutputType[P]>
            : GetScalarType<T[P], PatientGroupByOutputType[P]>
        }
      >
    >


  export type PatientSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    fullname?: boolean
    lastname?: boolean
    firstname?: boolean
    middlename?: boolean
    suffix?: boolean
    prefix?: boolean
    gender?: boolean
    dob?: boolean
    email?: boolean
    fulladdress?: boolean
    address?: boolean
    barangay?: boolean
    barangayname?: boolean
    city?: boolean
    cityname?: boolean
    state?: boolean
    zipcode?: boolean
    nationality?: boolean
    country?: boolean
    religion?: boolean
    contactno?: boolean
    moblie?: boolean
    faxno?: boolean
    philhealth?: boolean
    seniorid?: boolean
    pwd?: boolean
    expirydatepwd?: boolean
    status?: boolean
    isactive?: boolean
    remarks?: boolean
    picturelink?: boolean
    uploadid?: boolean
    inputdate?: boolean
    inputby?: boolean
    updatedate?: boolean
    updateby?: boolean
    lastvisit?: boolean
    passportno?: boolean
    employeeid?: boolean
    rdob?: boolean
    uploaddatetime?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    fullname?: boolean
    lastname?: boolean
    firstname?: boolean
    middlename?: boolean
    suffix?: boolean
    prefix?: boolean
    gender?: boolean
    dob?: boolean
    email?: boolean
    fulladdress?: boolean
    address?: boolean
    barangay?: boolean
    barangayname?: boolean
    city?: boolean
    cityname?: boolean
    state?: boolean
    zipcode?: boolean
    nationality?: boolean
    country?: boolean
    religion?: boolean
    contactno?: boolean
    moblie?: boolean
    faxno?: boolean
    philhealth?: boolean
    seniorid?: boolean
    pwd?: boolean
    expirydatepwd?: boolean
    status?: boolean
    isactive?: boolean
    remarks?: boolean
    picturelink?: boolean
    uploadid?: boolean
    inputdate?: boolean
    inputby?: boolean
    updatedate?: boolean
    updateby?: boolean
    lastvisit?: boolean
    passportno?: boolean
    employeeid?: boolean
    rdob?: boolean
    uploaddatetime?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    fullname?: boolean
    lastname?: boolean
    firstname?: boolean
    middlename?: boolean
    suffix?: boolean
    prefix?: boolean
    gender?: boolean
    dob?: boolean
    email?: boolean
    fulladdress?: boolean
    address?: boolean
    barangay?: boolean
    barangayname?: boolean
    city?: boolean
    cityname?: boolean
    state?: boolean
    zipcode?: boolean
    nationality?: boolean
    country?: boolean
    religion?: boolean
    contactno?: boolean
    moblie?: boolean
    faxno?: boolean
    philhealth?: boolean
    seniorid?: boolean
    pwd?: boolean
    expirydatepwd?: boolean
    status?: boolean
    isactive?: boolean
    remarks?: boolean
    picturelink?: boolean
    uploadid?: boolean
    inputdate?: boolean
    inputby?: boolean
    updatedate?: boolean
    updateby?: boolean
    lastvisit?: boolean
    passportno?: boolean
    employeeid?: boolean
    rdob?: boolean
    uploaddatetime?: boolean
  }, ExtArgs["result"]["patient"]>

  export type PatientSelectScalar = {
    id?: boolean
    code?: boolean
    fullname?: boolean
    lastname?: boolean
    firstname?: boolean
    middlename?: boolean
    suffix?: boolean
    prefix?: boolean
    gender?: boolean
    dob?: boolean
    email?: boolean
    fulladdress?: boolean
    address?: boolean
    barangay?: boolean
    barangayname?: boolean
    city?: boolean
    cityname?: boolean
    state?: boolean
    zipcode?: boolean
    nationality?: boolean
    country?: boolean
    religion?: boolean
    contactno?: boolean
    moblie?: boolean
    faxno?: boolean
    philhealth?: boolean
    seniorid?: boolean
    pwd?: boolean
    expirydatepwd?: boolean
    status?: boolean
    isactive?: boolean
    remarks?: boolean
    picturelink?: boolean
    uploadid?: boolean
    inputdate?: boolean
    inputby?: boolean
    updatedate?: boolean
    updateby?: boolean
    lastvisit?: boolean
    passportno?: boolean
    employeeid?: boolean
    rdob?: boolean
    uploaddatetime?: boolean
  }

  export type PatientOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "fullname" | "lastname" | "firstname" | "middlename" | "suffix" | "prefix" | "gender" | "dob" | "email" | "fulladdress" | "address" | "barangay" | "barangayname" | "city" | "cityname" | "state" | "zipcode" | "nationality" | "country" | "religion" | "contactno" | "moblie" | "faxno" | "philhealth" | "seniorid" | "pwd" | "expirydatepwd" | "status" | "isactive" | "remarks" | "picturelink" | "uploadid" | "inputdate" | "inputby" | "updatedate" | "updateby" | "lastvisit" | "passportno" | "employeeid" | "rdob" | "uploaddatetime", ExtArgs["result"]["patient"]>

  export type $PatientPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Patient"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      code: string | null
      fullname: string | null
      lastname: string | null
      firstname: string | null
      middlename: string | null
      suffix: string | null
      prefix: string | null
      gender: string | null
      dob: Date
      email: string | null
      fulladdress: string | null
      address: string | null
      barangay: string | null
      barangayname: string | null
      city: string | null
      cityname: string | null
      state: string | null
      zipcode: string | null
      nationality: string | null
      country: string | null
      religion: string | null
      contactno: string | null
      moblie: string | null
      faxno: string | null
      philhealth: string | null
      seniorid: string | null
      pwd: string | null
      expirydatepwd: Date | null
      status: string | null
      isactive: number
      remarks: string | null
      picturelink: string | null
      uploadid: string | null
      inputdate: Date | null
      inputby: string | null
      updatedate: Date | null
      updateby: string | null
      lastvisit: Date | null
      passportno: string | null
      employeeid: string | null
      rdob: string | null
      uploaddatetime: Date
    }, ExtArgs["result"]["patient"]>
    composites: {}
  }

  type PatientGetPayload<S extends boolean | null | undefined | PatientDefaultArgs> = $Result.GetResult<Prisma.$PatientPayload, S>

  type PatientCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PatientFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PatientCountAggregateInputType | true
    }

  export interface PatientDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Patient'], meta: { name: 'Patient' } }
    /**
     * Find zero or one Patient that matches the filter.
     * @param {PatientFindUniqueArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PatientFindUniqueArgs>(args: SelectSubset<T, PatientFindUniqueArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Patient that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PatientFindUniqueOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PatientFindUniqueOrThrowArgs>(args: SelectSubset<T, PatientFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PatientFindFirstArgs>(args?: SelectSubset<T, PatientFindFirstArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Patient that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindFirstOrThrowArgs} args - Arguments to find a Patient
     * @example
     * // Get one Patient
     * const patient = await prisma.patient.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PatientFindFirstOrThrowArgs>(args?: SelectSubset<T, PatientFindFirstOrThrowArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Patients that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Patients
     * const patients = await prisma.patient.findMany()
     * 
     * // Get first 10 Patients
     * const patients = await prisma.patient.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const patientWithIdOnly = await prisma.patient.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PatientFindManyArgs>(args?: SelectSubset<T, PatientFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Patient.
     * @param {PatientCreateArgs} args - Arguments to create a Patient.
     * @example
     * // Create one Patient
     * const Patient = await prisma.patient.create({
     *   data: {
     *     // ... data to create a Patient
     *   }
     * })
     * 
     */
    create<T extends PatientCreateArgs>(args: SelectSubset<T, PatientCreateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Patients.
     * @param {PatientCreateManyArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PatientCreateManyArgs>(args?: SelectSubset<T, PatientCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Patients and returns the data saved in the database.
     * @param {PatientCreateManyAndReturnArgs} args - Arguments to create many Patients.
     * @example
     * // Create many Patients
     * const patient = await prisma.patient.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PatientCreateManyAndReturnArgs>(args?: SelectSubset<T, PatientCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Patient.
     * @param {PatientDeleteArgs} args - Arguments to delete one Patient.
     * @example
     * // Delete one Patient
     * const Patient = await prisma.patient.delete({
     *   where: {
     *     // ... filter to delete one Patient
     *   }
     * })
     * 
     */
    delete<T extends PatientDeleteArgs>(args: SelectSubset<T, PatientDeleteArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Patient.
     * @param {PatientUpdateArgs} args - Arguments to update one Patient.
     * @example
     * // Update one Patient
     * const patient = await prisma.patient.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PatientUpdateArgs>(args: SelectSubset<T, PatientUpdateArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Patients.
     * @param {PatientDeleteManyArgs} args - Arguments to filter Patients to delete.
     * @example
     * // Delete a few Patients
     * const { count } = await prisma.patient.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PatientDeleteManyArgs>(args?: SelectSubset<T, PatientDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PatientUpdateManyArgs>(args: SelectSubset<T, PatientUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Patients and returns the data updated in the database.
     * @param {PatientUpdateManyAndReturnArgs} args - Arguments to update many Patients.
     * @example
     * // Update many Patients
     * const patient = await prisma.patient.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Patients and only return the `id`
     * const patientWithIdOnly = await prisma.patient.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PatientUpdateManyAndReturnArgs>(args: SelectSubset<T, PatientUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Patient.
     * @param {PatientUpsertArgs} args - Arguments to update or create a Patient.
     * @example
     * // Update or create a Patient
     * const patient = await prisma.patient.upsert({
     *   create: {
     *     // ... data to create a Patient
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Patient we want to update
     *   }
     * })
     */
    upsert<T extends PatientUpsertArgs>(args: SelectSubset<T, PatientUpsertArgs<ExtArgs>>): Prisma__PatientClient<$Result.GetResult<Prisma.$PatientPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Patients.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientCountArgs} args - Arguments to filter Patients to count.
     * @example
     * // Count the number of Patients
     * const count = await prisma.patient.count({
     *   where: {
     *     // ... the filter for the Patients we want to count
     *   }
     * })
    **/
    count<T extends PatientCountArgs>(
      args?: Subset<T, PatientCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PatientCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PatientAggregateArgs>(args: Subset<T, PatientAggregateArgs>): Prisma.PrismaPromise<GetPatientAggregateType<T>>

    /**
     * Group by Patient.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PatientGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PatientGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PatientGroupByArgs['orderBy'] }
        : { orderBy?: PatientGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PatientGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPatientGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Patient model
   */
  readonly fields: PatientFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Patient.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PatientClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Patient model
   */
  interface PatientFieldRefs {
    readonly id: FieldRef<"Patient", 'BigInt'>
    readonly code: FieldRef<"Patient", 'String'>
    readonly fullname: FieldRef<"Patient", 'String'>
    readonly lastname: FieldRef<"Patient", 'String'>
    readonly firstname: FieldRef<"Patient", 'String'>
    readonly middlename: FieldRef<"Patient", 'String'>
    readonly suffix: FieldRef<"Patient", 'String'>
    readonly prefix: FieldRef<"Patient", 'String'>
    readonly gender: FieldRef<"Patient", 'String'>
    readonly dob: FieldRef<"Patient", 'DateTime'>
    readonly email: FieldRef<"Patient", 'String'>
    readonly fulladdress: FieldRef<"Patient", 'String'>
    readonly address: FieldRef<"Patient", 'String'>
    readonly barangay: FieldRef<"Patient", 'String'>
    readonly barangayname: FieldRef<"Patient", 'String'>
    readonly city: FieldRef<"Patient", 'String'>
    readonly cityname: FieldRef<"Patient", 'String'>
    readonly state: FieldRef<"Patient", 'String'>
    readonly zipcode: FieldRef<"Patient", 'String'>
    readonly nationality: FieldRef<"Patient", 'String'>
    readonly country: FieldRef<"Patient", 'String'>
    readonly religion: FieldRef<"Patient", 'String'>
    readonly contactno: FieldRef<"Patient", 'String'>
    readonly moblie: FieldRef<"Patient", 'String'>
    readonly faxno: FieldRef<"Patient", 'String'>
    readonly philhealth: FieldRef<"Patient", 'String'>
    readonly seniorid: FieldRef<"Patient", 'String'>
    readonly pwd: FieldRef<"Patient", 'String'>
    readonly expirydatepwd: FieldRef<"Patient", 'DateTime'>
    readonly status: FieldRef<"Patient", 'String'>
    readonly isactive: FieldRef<"Patient", 'Int'>
    readonly remarks: FieldRef<"Patient", 'String'>
    readonly picturelink: FieldRef<"Patient", 'String'>
    readonly uploadid: FieldRef<"Patient", 'String'>
    readonly inputdate: FieldRef<"Patient", 'DateTime'>
    readonly inputby: FieldRef<"Patient", 'String'>
    readonly updatedate: FieldRef<"Patient", 'DateTime'>
    readonly updateby: FieldRef<"Patient", 'String'>
    readonly lastvisit: FieldRef<"Patient", 'DateTime'>
    readonly passportno: FieldRef<"Patient", 'String'>
    readonly employeeid: FieldRef<"Patient", 'String'>
    readonly rdob: FieldRef<"Patient", 'String'>
    readonly uploaddatetime: FieldRef<"Patient", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Patient findUnique
   */
  export type PatientFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findUniqueOrThrow
   */
  export type PatientFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient findFirst
   */
  export type PatientFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findFirstOrThrow
   */
  export type PatientFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patient to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Patients.
     */
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient findMany
   */
  export type PatientFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter, which Patients to fetch.
     */
    where?: PatientWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Patients to fetch.
     */
    orderBy?: PatientOrderByWithRelationInput | PatientOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Patients.
     */
    cursor?: PatientWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Patients from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Patients.
     */
    skip?: number
    distinct?: PatientScalarFieldEnum | PatientScalarFieldEnum[]
  }

  /**
   * Patient create
   */
  export type PatientCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data needed to create a Patient.
     */
    data: XOR<PatientCreateInput, PatientUncheckedCreateInput>
  }

  /**
   * Patient createMany
   */
  export type PatientCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient createManyAndReturn
   */
  export type PatientCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to create many Patients.
     */
    data: PatientCreateManyInput | PatientCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Patient update
   */
  export type PatientUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data needed to update a Patient.
     */
    data: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
    /**
     * Choose, which Patient to update.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient updateMany
   */
  export type PatientUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient updateManyAndReturn
   */
  export type PatientUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The data used to update Patients.
     */
    data: XOR<PatientUpdateManyMutationInput, PatientUncheckedUpdateManyInput>
    /**
     * Filter which Patients to update
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to update.
     */
    limit?: number
  }

  /**
   * Patient upsert
   */
  export type PatientUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * The filter to search for the Patient to update in case it exists.
     */
    where: PatientWhereUniqueInput
    /**
     * In case the Patient found by the `where` argument doesn't exist, create a new Patient with this data.
     */
    create: XOR<PatientCreateInput, PatientUncheckedCreateInput>
    /**
     * In case the Patient was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PatientUpdateInput, PatientUncheckedUpdateInput>
  }

  /**
   * Patient delete
   */
  export type PatientDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
    /**
     * Filter which Patient to delete.
     */
    where: PatientWhereUniqueInput
  }

  /**
   * Patient deleteMany
   */
  export type PatientDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Patients to delete
     */
    where?: PatientWhereInput
    /**
     * Limit how many Patients to delete.
     */
    limit?: number
  }

  /**
   * Patient without action
   */
  export type PatientDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Patient
     */
    select?: PatientSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Patient
     */
    omit?: PatientOmit<ExtArgs> | null
  }


  /**
   * Model CardEnrollment
   */

  export type AggregateCardEnrollment = {
    _count: CardEnrollmentCountAggregateOutputType | null
    _avg: CardEnrollmentAvgAggregateOutputType | null
    _sum: CardEnrollmentSumAggregateOutputType | null
    _min: CardEnrollmentMinAggregateOutputType | null
    _max: CardEnrollmentMaxAggregateOutputType | null
  }

  export type CardEnrollmentAvgAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CardEnrollmentSumAggregateOutputType = {
    id: number | null
    status: number | null
  }

  export type CardEnrollmentMinAggregateOutputType = {
    id: number | null
    cardnumber: string | null
    dateenrolled: Date | null
    receivedby: string | null
    receiveddate: Date | null
    releaseto: string | null
    oldreleaseto: string | null
    releaseby: string | null
    daterelease: Date | null
    transferto: string | null
    datetransfer: Date | null
    transferby: string | null
    status: number | null
  }

  export type CardEnrollmentMaxAggregateOutputType = {
    id: number | null
    cardnumber: string | null
    dateenrolled: Date | null
    receivedby: string | null
    receiveddate: Date | null
    releaseto: string | null
    oldreleaseto: string | null
    releaseby: string | null
    daterelease: Date | null
    transferto: string | null
    datetransfer: Date | null
    transferby: string | null
    status: number | null
  }

  export type CardEnrollmentCountAggregateOutputType = {
    id: number
    cardnumber: number
    dateenrolled: number
    receivedby: number
    receiveddate: number
    releaseto: number
    oldreleaseto: number
    releaseby: number
    daterelease: number
    transferto: number
    datetransfer: number
    transferby: number
    status: number
    _all: number
  }


  export type CardEnrollmentAvgAggregateInputType = {
    id?: true
    status?: true
  }

  export type CardEnrollmentSumAggregateInputType = {
    id?: true
    status?: true
  }

  export type CardEnrollmentMinAggregateInputType = {
    id?: true
    cardnumber?: true
    dateenrolled?: true
    receivedby?: true
    receiveddate?: true
    releaseto?: true
    oldreleaseto?: true
    releaseby?: true
    daterelease?: true
    transferto?: true
    datetransfer?: true
    transferby?: true
    status?: true
  }

  export type CardEnrollmentMaxAggregateInputType = {
    id?: true
    cardnumber?: true
    dateenrolled?: true
    receivedby?: true
    receiveddate?: true
    releaseto?: true
    oldreleaseto?: true
    releaseby?: true
    daterelease?: true
    transferto?: true
    datetransfer?: true
    transferby?: true
    status?: true
  }

  export type CardEnrollmentCountAggregateInputType = {
    id?: true
    cardnumber?: true
    dateenrolled?: true
    receivedby?: true
    receiveddate?: true
    releaseto?: true
    oldreleaseto?: true
    releaseby?: true
    daterelease?: true
    transferto?: true
    datetransfer?: true
    transferby?: true
    status?: true
    _all?: true
  }

  export type CardEnrollmentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CardEnrollment to aggregate.
     */
    where?: CardEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardEnrollments to fetch.
     */
    orderBy?: CardEnrollmentOrderByWithRelationInput | CardEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CardEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CardEnrollments
    **/
    _count?: true | CardEnrollmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CardEnrollmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CardEnrollmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CardEnrollmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CardEnrollmentMaxAggregateInputType
  }

  export type GetCardEnrollmentAggregateType<T extends CardEnrollmentAggregateArgs> = {
        [P in keyof T & keyof AggregateCardEnrollment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCardEnrollment[P]>
      : GetScalarType<T[P], AggregateCardEnrollment[P]>
  }




  export type CardEnrollmentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CardEnrollmentWhereInput
    orderBy?: CardEnrollmentOrderByWithAggregationInput | CardEnrollmentOrderByWithAggregationInput[]
    by: CardEnrollmentScalarFieldEnum[] | CardEnrollmentScalarFieldEnum
    having?: CardEnrollmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CardEnrollmentCountAggregateInputType | true
    _avg?: CardEnrollmentAvgAggregateInputType
    _sum?: CardEnrollmentSumAggregateInputType
    _min?: CardEnrollmentMinAggregateInputType
    _max?: CardEnrollmentMaxAggregateInputType
  }

  export type CardEnrollmentGroupByOutputType = {
    id: number
    cardnumber: string | null
    dateenrolled: Date | null
    receivedby: string | null
    receiveddate: Date | null
    releaseto: string | null
    oldreleaseto: string | null
    releaseby: string | null
    daterelease: Date | null
    transferto: string | null
    datetransfer: Date | null
    transferby: string | null
    status: number | null
    _count: CardEnrollmentCountAggregateOutputType | null
    _avg: CardEnrollmentAvgAggregateOutputType | null
    _sum: CardEnrollmentSumAggregateOutputType | null
    _min: CardEnrollmentMinAggregateOutputType | null
    _max: CardEnrollmentMaxAggregateOutputType | null
  }

  type GetCardEnrollmentGroupByPayload<T extends CardEnrollmentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CardEnrollmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CardEnrollmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CardEnrollmentGroupByOutputType[P]>
            : GetScalarType<T[P], CardEnrollmentGroupByOutputType[P]>
        }
      >
    >


  export type CardEnrollmentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cardnumber?: boolean
    dateenrolled?: boolean
    receivedby?: boolean
    receiveddate?: boolean
    releaseto?: boolean
    oldreleaseto?: boolean
    releaseby?: boolean
    daterelease?: boolean
    transferto?: boolean
    datetransfer?: boolean
    transferby?: boolean
    status?: boolean
  }, ExtArgs["result"]["cardEnrollment"]>

  export type CardEnrollmentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cardnumber?: boolean
    dateenrolled?: boolean
    receivedby?: boolean
    receiveddate?: boolean
    releaseto?: boolean
    oldreleaseto?: boolean
    releaseby?: boolean
    daterelease?: boolean
    transferto?: boolean
    datetransfer?: boolean
    transferby?: boolean
    status?: boolean
  }, ExtArgs["result"]["cardEnrollment"]>

  export type CardEnrollmentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    cardnumber?: boolean
    dateenrolled?: boolean
    receivedby?: boolean
    receiveddate?: boolean
    releaseto?: boolean
    oldreleaseto?: boolean
    releaseby?: boolean
    daterelease?: boolean
    transferto?: boolean
    datetransfer?: boolean
    transferby?: boolean
    status?: boolean
  }, ExtArgs["result"]["cardEnrollment"]>

  export type CardEnrollmentSelectScalar = {
    id?: boolean
    cardnumber?: boolean
    dateenrolled?: boolean
    receivedby?: boolean
    receiveddate?: boolean
    releaseto?: boolean
    oldreleaseto?: boolean
    releaseby?: boolean
    daterelease?: boolean
    transferto?: boolean
    datetransfer?: boolean
    transferby?: boolean
    status?: boolean
  }

  export type CardEnrollmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "cardnumber" | "dateenrolled" | "receivedby" | "receiveddate" | "releaseto" | "oldreleaseto" | "releaseby" | "daterelease" | "transferto" | "datetransfer" | "transferby" | "status", ExtArgs["result"]["cardEnrollment"]>

  export type $CardEnrollmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CardEnrollment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      cardnumber: string | null
      dateenrolled: Date | null
      receivedby: string | null
      receiveddate: Date | null
      releaseto: string | null
      oldreleaseto: string | null
      releaseby: string | null
      daterelease: Date | null
      transferto: string | null
      datetransfer: Date | null
      transferby: string | null
      status: number | null
    }, ExtArgs["result"]["cardEnrollment"]>
    composites: {}
  }

  type CardEnrollmentGetPayload<S extends boolean | null | undefined | CardEnrollmentDefaultArgs> = $Result.GetResult<Prisma.$CardEnrollmentPayload, S>

  type CardEnrollmentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CardEnrollmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CardEnrollmentCountAggregateInputType | true
    }

  export interface CardEnrollmentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CardEnrollment'], meta: { name: 'CardEnrollment' } }
    /**
     * Find zero or one CardEnrollment that matches the filter.
     * @param {CardEnrollmentFindUniqueArgs} args - Arguments to find a CardEnrollment
     * @example
     * // Get one CardEnrollment
     * const cardEnrollment = await prisma.cardEnrollment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CardEnrollmentFindUniqueArgs>(args: SelectSubset<T, CardEnrollmentFindUniqueArgs<ExtArgs>>): Prisma__CardEnrollmentClient<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CardEnrollment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CardEnrollmentFindUniqueOrThrowArgs} args - Arguments to find a CardEnrollment
     * @example
     * // Get one CardEnrollment
     * const cardEnrollment = await prisma.cardEnrollment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CardEnrollmentFindUniqueOrThrowArgs>(args: SelectSubset<T, CardEnrollmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CardEnrollmentClient<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CardEnrollment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardEnrollmentFindFirstArgs} args - Arguments to find a CardEnrollment
     * @example
     * // Get one CardEnrollment
     * const cardEnrollment = await prisma.cardEnrollment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CardEnrollmentFindFirstArgs>(args?: SelectSubset<T, CardEnrollmentFindFirstArgs<ExtArgs>>): Prisma__CardEnrollmentClient<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CardEnrollment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardEnrollmentFindFirstOrThrowArgs} args - Arguments to find a CardEnrollment
     * @example
     * // Get one CardEnrollment
     * const cardEnrollment = await prisma.cardEnrollment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CardEnrollmentFindFirstOrThrowArgs>(args?: SelectSubset<T, CardEnrollmentFindFirstOrThrowArgs<ExtArgs>>): Prisma__CardEnrollmentClient<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CardEnrollments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardEnrollmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CardEnrollments
     * const cardEnrollments = await prisma.cardEnrollment.findMany()
     * 
     * // Get first 10 CardEnrollments
     * const cardEnrollments = await prisma.cardEnrollment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cardEnrollmentWithIdOnly = await prisma.cardEnrollment.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CardEnrollmentFindManyArgs>(args?: SelectSubset<T, CardEnrollmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CardEnrollment.
     * @param {CardEnrollmentCreateArgs} args - Arguments to create a CardEnrollment.
     * @example
     * // Create one CardEnrollment
     * const CardEnrollment = await prisma.cardEnrollment.create({
     *   data: {
     *     // ... data to create a CardEnrollment
     *   }
     * })
     * 
     */
    create<T extends CardEnrollmentCreateArgs>(args: SelectSubset<T, CardEnrollmentCreateArgs<ExtArgs>>): Prisma__CardEnrollmentClient<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CardEnrollments.
     * @param {CardEnrollmentCreateManyArgs} args - Arguments to create many CardEnrollments.
     * @example
     * // Create many CardEnrollments
     * const cardEnrollment = await prisma.cardEnrollment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CardEnrollmentCreateManyArgs>(args?: SelectSubset<T, CardEnrollmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CardEnrollments and returns the data saved in the database.
     * @param {CardEnrollmentCreateManyAndReturnArgs} args - Arguments to create many CardEnrollments.
     * @example
     * // Create many CardEnrollments
     * const cardEnrollment = await prisma.cardEnrollment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CardEnrollments and only return the `id`
     * const cardEnrollmentWithIdOnly = await prisma.cardEnrollment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CardEnrollmentCreateManyAndReturnArgs>(args?: SelectSubset<T, CardEnrollmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CardEnrollment.
     * @param {CardEnrollmentDeleteArgs} args - Arguments to delete one CardEnrollment.
     * @example
     * // Delete one CardEnrollment
     * const CardEnrollment = await prisma.cardEnrollment.delete({
     *   where: {
     *     // ... filter to delete one CardEnrollment
     *   }
     * })
     * 
     */
    delete<T extends CardEnrollmentDeleteArgs>(args: SelectSubset<T, CardEnrollmentDeleteArgs<ExtArgs>>): Prisma__CardEnrollmentClient<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CardEnrollment.
     * @param {CardEnrollmentUpdateArgs} args - Arguments to update one CardEnrollment.
     * @example
     * // Update one CardEnrollment
     * const cardEnrollment = await prisma.cardEnrollment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CardEnrollmentUpdateArgs>(args: SelectSubset<T, CardEnrollmentUpdateArgs<ExtArgs>>): Prisma__CardEnrollmentClient<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CardEnrollments.
     * @param {CardEnrollmentDeleteManyArgs} args - Arguments to filter CardEnrollments to delete.
     * @example
     * // Delete a few CardEnrollments
     * const { count } = await prisma.cardEnrollment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CardEnrollmentDeleteManyArgs>(args?: SelectSubset<T, CardEnrollmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CardEnrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardEnrollmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CardEnrollments
     * const cardEnrollment = await prisma.cardEnrollment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CardEnrollmentUpdateManyArgs>(args: SelectSubset<T, CardEnrollmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CardEnrollments and returns the data updated in the database.
     * @param {CardEnrollmentUpdateManyAndReturnArgs} args - Arguments to update many CardEnrollments.
     * @example
     * // Update many CardEnrollments
     * const cardEnrollment = await prisma.cardEnrollment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CardEnrollments and only return the `id`
     * const cardEnrollmentWithIdOnly = await prisma.cardEnrollment.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CardEnrollmentUpdateManyAndReturnArgs>(args: SelectSubset<T, CardEnrollmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CardEnrollment.
     * @param {CardEnrollmentUpsertArgs} args - Arguments to update or create a CardEnrollment.
     * @example
     * // Update or create a CardEnrollment
     * const cardEnrollment = await prisma.cardEnrollment.upsert({
     *   create: {
     *     // ... data to create a CardEnrollment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CardEnrollment we want to update
     *   }
     * })
     */
    upsert<T extends CardEnrollmentUpsertArgs>(args: SelectSubset<T, CardEnrollmentUpsertArgs<ExtArgs>>): Prisma__CardEnrollmentClient<$Result.GetResult<Prisma.$CardEnrollmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CardEnrollments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardEnrollmentCountArgs} args - Arguments to filter CardEnrollments to count.
     * @example
     * // Count the number of CardEnrollments
     * const count = await prisma.cardEnrollment.count({
     *   where: {
     *     // ... the filter for the CardEnrollments we want to count
     *   }
     * })
    **/
    count<T extends CardEnrollmentCountArgs>(
      args?: Subset<T, CardEnrollmentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CardEnrollmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CardEnrollment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardEnrollmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CardEnrollmentAggregateArgs>(args: Subset<T, CardEnrollmentAggregateArgs>): Prisma.PrismaPromise<GetCardEnrollmentAggregateType<T>>

    /**
     * Group by CardEnrollment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardEnrollmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CardEnrollmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CardEnrollmentGroupByArgs['orderBy'] }
        : { orderBy?: CardEnrollmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CardEnrollmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCardEnrollmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CardEnrollment model
   */
  readonly fields: CardEnrollmentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CardEnrollment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CardEnrollmentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CardEnrollment model
   */
  interface CardEnrollmentFieldRefs {
    readonly id: FieldRef<"CardEnrollment", 'Int'>
    readonly cardnumber: FieldRef<"CardEnrollment", 'String'>
    readonly dateenrolled: FieldRef<"CardEnrollment", 'DateTime'>
    readonly receivedby: FieldRef<"CardEnrollment", 'String'>
    readonly receiveddate: FieldRef<"CardEnrollment", 'DateTime'>
    readonly releaseto: FieldRef<"CardEnrollment", 'String'>
    readonly oldreleaseto: FieldRef<"CardEnrollment", 'String'>
    readonly releaseby: FieldRef<"CardEnrollment", 'String'>
    readonly daterelease: FieldRef<"CardEnrollment", 'DateTime'>
    readonly transferto: FieldRef<"CardEnrollment", 'String'>
    readonly datetransfer: FieldRef<"CardEnrollment", 'DateTime'>
    readonly transferby: FieldRef<"CardEnrollment", 'String'>
    readonly status: FieldRef<"CardEnrollment", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * CardEnrollment findUnique
   */
  export type CardEnrollmentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * Filter, which CardEnrollment to fetch.
     */
    where: CardEnrollmentWhereUniqueInput
  }

  /**
   * CardEnrollment findUniqueOrThrow
   */
  export type CardEnrollmentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * Filter, which CardEnrollment to fetch.
     */
    where: CardEnrollmentWhereUniqueInput
  }

  /**
   * CardEnrollment findFirst
   */
  export type CardEnrollmentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * Filter, which CardEnrollment to fetch.
     */
    where?: CardEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardEnrollments to fetch.
     */
    orderBy?: CardEnrollmentOrderByWithRelationInput | CardEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CardEnrollments.
     */
    cursor?: CardEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CardEnrollments.
     */
    distinct?: CardEnrollmentScalarFieldEnum | CardEnrollmentScalarFieldEnum[]
  }

  /**
   * CardEnrollment findFirstOrThrow
   */
  export type CardEnrollmentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * Filter, which CardEnrollment to fetch.
     */
    where?: CardEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardEnrollments to fetch.
     */
    orderBy?: CardEnrollmentOrderByWithRelationInput | CardEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CardEnrollments.
     */
    cursor?: CardEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardEnrollments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CardEnrollments.
     */
    distinct?: CardEnrollmentScalarFieldEnum | CardEnrollmentScalarFieldEnum[]
  }

  /**
   * CardEnrollment findMany
   */
  export type CardEnrollmentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * Filter, which CardEnrollments to fetch.
     */
    where?: CardEnrollmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardEnrollments to fetch.
     */
    orderBy?: CardEnrollmentOrderByWithRelationInput | CardEnrollmentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CardEnrollments.
     */
    cursor?: CardEnrollmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardEnrollments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardEnrollments.
     */
    skip?: number
    distinct?: CardEnrollmentScalarFieldEnum | CardEnrollmentScalarFieldEnum[]
  }

  /**
   * CardEnrollment create
   */
  export type CardEnrollmentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * The data needed to create a CardEnrollment.
     */
    data?: XOR<CardEnrollmentCreateInput, CardEnrollmentUncheckedCreateInput>
  }

  /**
   * CardEnrollment createMany
   */
  export type CardEnrollmentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CardEnrollments.
     */
    data: CardEnrollmentCreateManyInput | CardEnrollmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CardEnrollment createManyAndReturn
   */
  export type CardEnrollmentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * The data used to create many CardEnrollments.
     */
    data: CardEnrollmentCreateManyInput | CardEnrollmentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CardEnrollment update
   */
  export type CardEnrollmentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * The data needed to update a CardEnrollment.
     */
    data: XOR<CardEnrollmentUpdateInput, CardEnrollmentUncheckedUpdateInput>
    /**
     * Choose, which CardEnrollment to update.
     */
    where: CardEnrollmentWhereUniqueInput
  }

  /**
   * CardEnrollment updateMany
   */
  export type CardEnrollmentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CardEnrollments.
     */
    data: XOR<CardEnrollmentUpdateManyMutationInput, CardEnrollmentUncheckedUpdateManyInput>
    /**
     * Filter which CardEnrollments to update
     */
    where?: CardEnrollmentWhereInput
    /**
     * Limit how many CardEnrollments to update.
     */
    limit?: number
  }

  /**
   * CardEnrollment updateManyAndReturn
   */
  export type CardEnrollmentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * The data used to update CardEnrollments.
     */
    data: XOR<CardEnrollmentUpdateManyMutationInput, CardEnrollmentUncheckedUpdateManyInput>
    /**
     * Filter which CardEnrollments to update
     */
    where?: CardEnrollmentWhereInput
    /**
     * Limit how many CardEnrollments to update.
     */
    limit?: number
  }

  /**
   * CardEnrollment upsert
   */
  export type CardEnrollmentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * The filter to search for the CardEnrollment to update in case it exists.
     */
    where: CardEnrollmentWhereUniqueInput
    /**
     * In case the CardEnrollment found by the `where` argument doesn't exist, create a new CardEnrollment with this data.
     */
    create: XOR<CardEnrollmentCreateInput, CardEnrollmentUncheckedCreateInput>
    /**
     * In case the CardEnrollment was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CardEnrollmentUpdateInput, CardEnrollmentUncheckedUpdateInput>
  }

  /**
   * CardEnrollment delete
   */
  export type CardEnrollmentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
    /**
     * Filter which CardEnrollment to delete.
     */
    where: CardEnrollmentWhereUniqueInput
  }

  /**
   * CardEnrollment deleteMany
   */
  export type CardEnrollmentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CardEnrollments to delete
     */
    where?: CardEnrollmentWhereInput
    /**
     * Limit how many CardEnrollments to delete.
     */
    limit?: number
  }

  /**
   * CardEnrollment without action
   */
  export type CardEnrollmentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardEnrollment
     */
    select?: CardEnrollmentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardEnrollment
     */
    omit?: CardEnrollmentOmit<ExtArgs> | null
  }


  /**
   * Model CardNumber
   */

  export type AggregateCardNumber = {
    _count: CardNumberCountAggregateOutputType | null
    _avg: CardNumberAvgAggregateOutputType | null
    _sum: CardNumberSumAggregateOutputType | null
    _min: CardNumberMinAggregateOutputType | null
    _max: CardNumberMaxAggregateOutputType | null
  }

  export type CardNumberAvgAggregateOutputType = {
    id: number | null
    year: number | null
    batch: number | null
    month: number | null
    seriesnum: number | null
  }

  export type CardNumberSumAggregateOutputType = {
    id: number | null
    year: number | null
    batch: number | null
    month: number | null
    seriesnum: number | null
  }

  export type CardNumberMinAggregateOutputType = {
    id: number | null
    year: number | null
    batch: number | null
    month: number | null
    seriesnum: number | null
    maskedseries: string | null
    generatedcardnumber: string | null
    codecompany: string | null
    generatedby: string | null
  }

  export type CardNumberMaxAggregateOutputType = {
    id: number | null
    year: number | null
    batch: number | null
    month: number | null
    seriesnum: number | null
    maskedseries: string | null
    generatedcardnumber: string | null
    codecompany: string | null
    generatedby: string | null
  }

  export type CardNumberCountAggregateOutputType = {
    id: number
    year: number
    batch: number
    month: number
    seriesnum: number
    maskedseries: number
    generatedcardnumber: number
    codecompany: number
    generatedby: number
    _all: number
  }


  export type CardNumberAvgAggregateInputType = {
    id?: true
    year?: true
    batch?: true
    month?: true
    seriesnum?: true
  }

  export type CardNumberSumAggregateInputType = {
    id?: true
    year?: true
    batch?: true
    month?: true
    seriesnum?: true
  }

  export type CardNumberMinAggregateInputType = {
    id?: true
    year?: true
    batch?: true
    month?: true
    seriesnum?: true
    maskedseries?: true
    generatedcardnumber?: true
    codecompany?: true
    generatedby?: true
  }

  export type CardNumberMaxAggregateInputType = {
    id?: true
    year?: true
    batch?: true
    month?: true
    seriesnum?: true
    maskedseries?: true
    generatedcardnumber?: true
    codecompany?: true
    generatedby?: true
  }

  export type CardNumberCountAggregateInputType = {
    id?: true
    year?: true
    batch?: true
    month?: true
    seriesnum?: true
    maskedseries?: true
    generatedcardnumber?: true
    codecompany?: true
    generatedby?: true
    _all?: true
  }

  export type CardNumberAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CardNumber to aggregate.
     */
    where?: CardNumberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardNumbers to fetch.
     */
    orderBy?: CardNumberOrderByWithRelationInput | CardNumberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CardNumberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardNumbers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardNumbers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CardNumbers
    **/
    _count?: true | CardNumberCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CardNumberAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CardNumberSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CardNumberMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CardNumberMaxAggregateInputType
  }

  export type GetCardNumberAggregateType<T extends CardNumberAggregateArgs> = {
        [P in keyof T & keyof AggregateCardNumber]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCardNumber[P]>
      : GetScalarType<T[P], AggregateCardNumber[P]>
  }




  export type CardNumberGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CardNumberWhereInput
    orderBy?: CardNumberOrderByWithAggregationInput | CardNumberOrderByWithAggregationInput[]
    by: CardNumberScalarFieldEnum[] | CardNumberScalarFieldEnum
    having?: CardNumberScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CardNumberCountAggregateInputType | true
    _avg?: CardNumberAvgAggregateInputType
    _sum?: CardNumberSumAggregateInputType
    _min?: CardNumberMinAggregateInputType
    _max?: CardNumberMaxAggregateInputType
  }

  export type CardNumberGroupByOutputType = {
    id: number
    year: number | null
    batch: number | null
    month: number | null
    seriesnum: number | null
    maskedseries: string | null
    generatedcardnumber: string
    codecompany: string | null
    generatedby: string | null
    _count: CardNumberCountAggregateOutputType | null
    _avg: CardNumberAvgAggregateOutputType | null
    _sum: CardNumberSumAggregateOutputType | null
    _min: CardNumberMinAggregateOutputType | null
    _max: CardNumberMaxAggregateOutputType | null
  }

  type GetCardNumberGroupByPayload<T extends CardNumberGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CardNumberGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CardNumberGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CardNumberGroupByOutputType[P]>
            : GetScalarType<T[P], CardNumberGroupByOutputType[P]>
        }
      >
    >


  export type CardNumberSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    year?: boolean
    batch?: boolean
    month?: boolean
    seriesnum?: boolean
    maskedseries?: boolean
    generatedcardnumber?: boolean
    codecompany?: boolean
    generatedby?: boolean
  }, ExtArgs["result"]["cardNumber"]>

  export type CardNumberSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    year?: boolean
    batch?: boolean
    month?: boolean
    seriesnum?: boolean
    maskedseries?: boolean
    generatedcardnumber?: boolean
    codecompany?: boolean
    generatedby?: boolean
  }, ExtArgs["result"]["cardNumber"]>

  export type CardNumberSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    year?: boolean
    batch?: boolean
    month?: boolean
    seriesnum?: boolean
    maskedseries?: boolean
    generatedcardnumber?: boolean
    codecompany?: boolean
    generatedby?: boolean
  }, ExtArgs["result"]["cardNumber"]>

  export type CardNumberSelectScalar = {
    id?: boolean
    year?: boolean
    batch?: boolean
    month?: boolean
    seriesnum?: boolean
    maskedseries?: boolean
    generatedcardnumber?: boolean
    codecompany?: boolean
    generatedby?: boolean
  }

  export type CardNumberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "year" | "batch" | "month" | "seriesnum" | "maskedseries" | "generatedcardnumber" | "codecompany" | "generatedby", ExtArgs["result"]["cardNumber"]>

  export type $CardNumberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CardNumber"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      year: number | null
      batch: number | null
      month: number | null
      seriesnum: number | null
      maskedseries: string | null
      generatedcardnumber: string
      codecompany: string | null
      generatedby: string | null
    }, ExtArgs["result"]["cardNumber"]>
    composites: {}
  }

  type CardNumberGetPayload<S extends boolean | null | undefined | CardNumberDefaultArgs> = $Result.GetResult<Prisma.$CardNumberPayload, S>

  type CardNumberCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CardNumberFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CardNumberCountAggregateInputType | true
    }

  export interface CardNumberDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CardNumber'], meta: { name: 'CardNumber' } }
    /**
     * Find zero or one CardNumber that matches the filter.
     * @param {CardNumberFindUniqueArgs} args - Arguments to find a CardNumber
     * @example
     * // Get one CardNumber
     * const cardNumber = await prisma.cardNumber.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CardNumberFindUniqueArgs>(args: SelectSubset<T, CardNumberFindUniqueArgs<ExtArgs>>): Prisma__CardNumberClient<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CardNumber that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CardNumberFindUniqueOrThrowArgs} args - Arguments to find a CardNumber
     * @example
     * // Get one CardNumber
     * const cardNumber = await prisma.cardNumber.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CardNumberFindUniqueOrThrowArgs>(args: SelectSubset<T, CardNumberFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CardNumberClient<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CardNumber that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardNumberFindFirstArgs} args - Arguments to find a CardNumber
     * @example
     * // Get one CardNumber
     * const cardNumber = await prisma.cardNumber.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CardNumberFindFirstArgs>(args?: SelectSubset<T, CardNumberFindFirstArgs<ExtArgs>>): Prisma__CardNumberClient<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CardNumber that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardNumberFindFirstOrThrowArgs} args - Arguments to find a CardNumber
     * @example
     * // Get one CardNumber
     * const cardNumber = await prisma.cardNumber.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CardNumberFindFirstOrThrowArgs>(args?: SelectSubset<T, CardNumberFindFirstOrThrowArgs<ExtArgs>>): Prisma__CardNumberClient<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CardNumbers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardNumberFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CardNumbers
     * const cardNumbers = await prisma.cardNumber.findMany()
     * 
     * // Get first 10 CardNumbers
     * const cardNumbers = await prisma.cardNumber.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cardNumberWithIdOnly = await prisma.cardNumber.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CardNumberFindManyArgs>(args?: SelectSubset<T, CardNumberFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CardNumber.
     * @param {CardNumberCreateArgs} args - Arguments to create a CardNumber.
     * @example
     * // Create one CardNumber
     * const CardNumber = await prisma.cardNumber.create({
     *   data: {
     *     // ... data to create a CardNumber
     *   }
     * })
     * 
     */
    create<T extends CardNumberCreateArgs>(args: SelectSubset<T, CardNumberCreateArgs<ExtArgs>>): Prisma__CardNumberClient<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CardNumbers.
     * @param {CardNumberCreateManyArgs} args - Arguments to create many CardNumbers.
     * @example
     * // Create many CardNumbers
     * const cardNumber = await prisma.cardNumber.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CardNumberCreateManyArgs>(args?: SelectSubset<T, CardNumberCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CardNumbers and returns the data saved in the database.
     * @param {CardNumberCreateManyAndReturnArgs} args - Arguments to create many CardNumbers.
     * @example
     * // Create many CardNumbers
     * const cardNumber = await prisma.cardNumber.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CardNumbers and only return the `id`
     * const cardNumberWithIdOnly = await prisma.cardNumber.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CardNumberCreateManyAndReturnArgs>(args?: SelectSubset<T, CardNumberCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CardNumber.
     * @param {CardNumberDeleteArgs} args - Arguments to delete one CardNumber.
     * @example
     * // Delete one CardNumber
     * const CardNumber = await prisma.cardNumber.delete({
     *   where: {
     *     // ... filter to delete one CardNumber
     *   }
     * })
     * 
     */
    delete<T extends CardNumberDeleteArgs>(args: SelectSubset<T, CardNumberDeleteArgs<ExtArgs>>): Prisma__CardNumberClient<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CardNumber.
     * @param {CardNumberUpdateArgs} args - Arguments to update one CardNumber.
     * @example
     * // Update one CardNumber
     * const cardNumber = await prisma.cardNumber.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CardNumberUpdateArgs>(args: SelectSubset<T, CardNumberUpdateArgs<ExtArgs>>): Prisma__CardNumberClient<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CardNumbers.
     * @param {CardNumberDeleteManyArgs} args - Arguments to filter CardNumbers to delete.
     * @example
     * // Delete a few CardNumbers
     * const { count } = await prisma.cardNumber.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CardNumberDeleteManyArgs>(args?: SelectSubset<T, CardNumberDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CardNumbers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardNumberUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CardNumbers
     * const cardNumber = await prisma.cardNumber.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CardNumberUpdateManyArgs>(args: SelectSubset<T, CardNumberUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CardNumbers and returns the data updated in the database.
     * @param {CardNumberUpdateManyAndReturnArgs} args - Arguments to update many CardNumbers.
     * @example
     * // Update many CardNumbers
     * const cardNumber = await prisma.cardNumber.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CardNumbers and only return the `id`
     * const cardNumberWithIdOnly = await prisma.cardNumber.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CardNumberUpdateManyAndReturnArgs>(args: SelectSubset<T, CardNumberUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CardNumber.
     * @param {CardNumberUpsertArgs} args - Arguments to update or create a CardNumber.
     * @example
     * // Update or create a CardNumber
     * const cardNumber = await prisma.cardNumber.upsert({
     *   create: {
     *     // ... data to create a CardNumber
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CardNumber we want to update
     *   }
     * })
     */
    upsert<T extends CardNumberUpsertArgs>(args: SelectSubset<T, CardNumberUpsertArgs<ExtArgs>>): Prisma__CardNumberClient<$Result.GetResult<Prisma.$CardNumberPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CardNumbers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardNumberCountArgs} args - Arguments to filter CardNumbers to count.
     * @example
     * // Count the number of CardNumbers
     * const count = await prisma.cardNumber.count({
     *   where: {
     *     // ... the filter for the CardNumbers we want to count
     *   }
     * })
    **/
    count<T extends CardNumberCountArgs>(
      args?: Subset<T, CardNumberCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CardNumberCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CardNumber.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardNumberAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CardNumberAggregateArgs>(args: Subset<T, CardNumberAggregateArgs>): Prisma.PrismaPromise<GetCardNumberAggregateType<T>>

    /**
     * Group by CardNumber.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardNumberGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CardNumberGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CardNumberGroupByArgs['orderBy'] }
        : { orderBy?: CardNumberGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CardNumberGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCardNumberGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CardNumber model
   */
  readonly fields: CardNumberFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CardNumber.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CardNumberClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CardNumber model
   */
  interface CardNumberFieldRefs {
    readonly id: FieldRef<"CardNumber", 'Int'>
    readonly year: FieldRef<"CardNumber", 'Int'>
    readonly batch: FieldRef<"CardNumber", 'Int'>
    readonly month: FieldRef<"CardNumber", 'Int'>
    readonly seriesnum: FieldRef<"CardNumber", 'Int'>
    readonly maskedseries: FieldRef<"CardNumber", 'String'>
    readonly generatedcardnumber: FieldRef<"CardNumber", 'String'>
    readonly codecompany: FieldRef<"CardNumber", 'String'>
    readonly generatedby: FieldRef<"CardNumber", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CardNumber findUnique
   */
  export type CardNumberFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * Filter, which CardNumber to fetch.
     */
    where: CardNumberWhereUniqueInput
  }

  /**
   * CardNumber findUniqueOrThrow
   */
  export type CardNumberFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * Filter, which CardNumber to fetch.
     */
    where: CardNumberWhereUniqueInput
  }

  /**
   * CardNumber findFirst
   */
  export type CardNumberFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * Filter, which CardNumber to fetch.
     */
    where?: CardNumberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardNumbers to fetch.
     */
    orderBy?: CardNumberOrderByWithRelationInput | CardNumberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CardNumbers.
     */
    cursor?: CardNumberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardNumbers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardNumbers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CardNumbers.
     */
    distinct?: CardNumberScalarFieldEnum | CardNumberScalarFieldEnum[]
  }

  /**
   * CardNumber findFirstOrThrow
   */
  export type CardNumberFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * Filter, which CardNumber to fetch.
     */
    where?: CardNumberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardNumbers to fetch.
     */
    orderBy?: CardNumberOrderByWithRelationInput | CardNumberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CardNumbers.
     */
    cursor?: CardNumberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardNumbers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardNumbers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CardNumbers.
     */
    distinct?: CardNumberScalarFieldEnum | CardNumberScalarFieldEnum[]
  }

  /**
   * CardNumber findMany
   */
  export type CardNumberFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * Filter, which CardNumbers to fetch.
     */
    where?: CardNumberWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardNumbers to fetch.
     */
    orderBy?: CardNumberOrderByWithRelationInput | CardNumberOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CardNumbers.
     */
    cursor?: CardNumberWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardNumbers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardNumbers.
     */
    skip?: number
    distinct?: CardNumberScalarFieldEnum | CardNumberScalarFieldEnum[]
  }

  /**
   * CardNumber create
   */
  export type CardNumberCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * The data needed to create a CardNumber.
     */
    data: XOR<CardNumberCreateInput, CardNumberUncheckedCreateInput>
  }

  /**
   * CardNumber createMany
   */
  export type CardNumberCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CardNumbers.
     */
    data: CardNumberCreateManyInput | CardNumberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CardNumber createManyAndReturn
   */
  export type CardNumberCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * The data used to create many CardNumbers.
     */
    data: CardNumberCreateManyInput | CardNumberCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CardNumber update
   */
  export type CardNumberUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * The data needed to update a CardNumber.
     */
    data: XOR<CardNumberUpdateInput, CardNumberUncheckedUpdateInput>
    /**
     * Choose, which CardNumber to update.
     */
    where: CardNumberWhereUniqueInput
  }

  /**
   * CardNumber updateMany
   */
  export type CardNumberUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CardNumbers.
     */
    data: XOR<CardNumberUpdateManyMutationInput, CardNumberUncheckedUpdateManyInput>
    /**
     * Filter which CardNumbers to update
     */
    where?: CardNumberWhereInput
    /**
     * Limit how many CardNumbers to update.
     */
    limit?: number
  }

  /**
   * CardNumber updateManyAndReturn
   */
  export type CardNumberUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * The data used to update CardNumbers.
     */
    data: XOR<CardNumberUpdateManyMutationInput, CardNumberUncheckedUpdateManyInput>
    /**
     * Filter which CardNumbers to update
     */
    where?: CardNumberWhereInput
    /**
     * Limit how many CardNumbers to update.
     */
    limit?: number
  }

  /**
   * CardNumber upsert
   */
  export type CardNumberUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * The filter to search for the CardNumber to update in case it exists.
     */
    where: CardNumberWhereUniqueInput
    /**
     * In case the CardNumber found by the `where` argument doesn't exist, create a new CardNumber with this data.
     */
    create: XOR<CardNumberCreateInput, CardNumberUncheckedCreateInput>
    /**
     * In case the CardNumber was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CardNumberUpdateInput, CardNumberUncheckedUpdateInput>
  }

  /**
   * CardNumber delete
   */
  export type CardNumberDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
    /**
     * Filter which CardNumber to delete.
     */
    where: CardNumberWhereUniqueInput
  }

  /**
   * CardNumber deleteMany
   */
  export type CardNumberDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CardNumbers to delete
     */
    where?: CardNumberWhereInput
    /**
     * Limit how many CardNumbers to delete.
     */
    limit?: number
  }

  /**
   * CardNumber without action
   */
  export type CardNumberDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardNumber
     */
    select?: CardNumberSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardNumber
     */
    omit?: CardNumberOmit<ExtArgs> | null
  }


  /**
   * Model CardVerified
   */

  export type AggregateCardVerified = {
    _count: CardVerifiedCountAggregateOutputType | null
    _avg: CardVerifiedAvgAggregateOutputType | null
    _sum: CardVerifiedSumAggregateOutputType | null
    _min: CardVerifiedMinAggregateOutputType | null
    _max: CardVerifiedMaxAggregateOutputType | null
  }

  export type CardVerifiedAvgAggregateOutputType = {
    id: number | null
  }

  export type CardVerifiedSumAggregateOutputType = {
    id: number | null
  }

  export type CardVerifiedMinAggregateOutputType = {
    id: number | null
    verifiedcardnumbers: string | null
    ictreceived: string | null
    datereceived: Date | null
  }

  export type CardVerifiedMaxAggregateOutputType = {
    id: number | null
    verifiedcardnumbers: string | null
    ictreceived: string | null
    datereceived: Date | null
  }

  export type CardVerifiedCountAggregateOutputType = {
    id: number
    verifiedcardnumbers: number
    ictreceived: number
    datereceived: number
    _all: number
  }


  export type CardVerifiedAvgAggregateInputType = {
    id?: true
  }

  export type CardVerifiedSumAggregateInputType = {
    id?: true
  }

  export type CardVerifiedMinAggregateInputType = {
    id?: true
    verifiedcardnumbers?: true
    ictreceived?: true
    datereceived?: true
  }

  export type CardVerifiedMaxAggregateInputType = {
    id?: true
    verifiedcardnumbers?: true
    ictreceived?: true
    datereceived?: true
  }

  export type CardVerifiedCountAggregateInputType = {
    id?: true
    verifiedcardnumbers?: true
    ictreceived?: true
    datereceived?: true
    _all?: true
  }

  export type CardVerifiedAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CardVerified to aggregate.
     */
    where?: CardVerifiedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardVerifieds to fetch.
     */
    orderBy?: CardVerifiedOrderByWithRelationInput | CardVerifiedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CardVerifiedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardVerifieds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardVerifieds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CardVerifieds
    **/
    _count?: true | CardVerifiedCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CardVerifiedAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CardVerifiedSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CardVerifiedMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CardVerifiedMaxAggregateInputType
  }

  export type GetCardVerifiedAggregateType<T extends CardVerifiedAggregateArgs> = {
        [P in keyof T & keyof AggregateCardVerified]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCardVerified[P]>
      : GetScalarType<T[P], AggregateCardVerified[P]>
  }




  export type CardVerifiedGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CardVerifiedWhereInput
    orderBy?: CardVerifiedOrderByWithAggregationInput | CardVerifiedOrderByWithAggregationInput[]
    by: CardVerifiedScalarFieldEnum[] | CardVerifiedScalarFieldEnum
    having?: CardVerifiedScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CardVerifiedCountAggregateInputType | true
    _avg?: CardVerifiedAvgAggregateInputType
    _sum?: CardVerifiedSumAggregateInputType
    _min?: CardVerifiedMinAggregateInputType
    _max?: CardVerifiedMaxAggregateInputType
  }

  export type CardVerifiedGroupByOutputType = {
    id: number
    verifiedcardnumbers: string
    ictreceived: string | null
    datereceived: Date | null
    _count: CardVerifiedCountAggregateOutputType | null
    _avg: CardVerifiedAvgAggregateOutputType | null
    _sum: CardVerifiedSumAggregateOutputType | null
    _min: CardVerifiedMinAggregateOutputType | null
    _max: CardVerifiedMaxAggregateOutputType | null
  }

  type GetCardVerifiedGroupByPayload<T extends CardVerifiedGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CardVerifiedGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CardVerifiedGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CardVerifiedGroupByOutputType[P]>
            : GetScalarType<T[P], CardVerifiedGroupByOutputType[P]>
        }
      >
    >


  export type CardVerifiedSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    verifiedcardnumbers?: boolean
    ictreceived?: boolean
    datereceived?: boolean
  }, ExtArgs["result"]["cardVerified"]>

  export type CardVerifiedSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    verifiedcardnumbers?: boolean
    ictreceived?: boolean
    datereceived?: boolean
  }, ExtArgs["result"]["cardVerified"]>

  export type CardVerifiedSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    verifiedcardnumbers?: boolean
    ictreceived?: boolean
    datereceived?: boolean
  }, ExtArgs["result"]["cardVerified"]>

  export type CardVerifiedSelectScalar = {
    id?: boolean
    verifiedcardnumbers?: boolean
    ictreceived?: boolean
    datereceived?: boolean
  }

  export type CardVerifiedOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "verifiedcardnumbers" | "ictreceived" | "datereceived", ExtArgs["result"]["cardVerified"]>

  export type $CardVerifiedPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CardVerified"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      verifiedcardnumbers: string
      ictreceived: string | null
      datereceived: Date | null
    }, ExtArgs["result"]["cardVerified"]>
    composites: {}
  }

  type CardVerifiedGetPayload<S extends boolean | null | undefined | CardVerifiedDefaultArgs> = $Result.GetResult<Prisma.$CardVerifiedPayload, S>

  type CardVerifiedCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CardVerifiedFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CardVerifiedCountAggregateInputType | true
    }

  export interface CardVerifiedDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CardVerified'], meta: { name: 'CardVerified' } }
    /**
     * Find zero or one CardVerified that matches the filter.
     * @param {CardVerifiedFindUniqueArgs} args - Arguments to find a CardVerified
     * @example
     * // Get one CardVerified
     * const cardVerified = await prisma.cardVerified.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CardVerifiedFindUniqueArgs>(args: SelectSubset<T, CardVerifiedFindUniqueArgs<ExtArgs>>): Prisma__CardVerifiedClient<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CardVerified that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CardVerifiedFindUniqueOrThrowArgs} args - Arguments to find a CardVerified
     * @example
     * // Get one CardVerified
     * const cardVerified = await prisma.cardVerified.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CardVerifiedFindUniqueOrThrowArgs>(args: SelectSubset<T, CardVerifiedFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CardVerifiedClient<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CardVerified that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardVerifiedFindFirstArgs} args - Arguments to find a CardVerified
     * @example
     * // Get one CardVerified
     * const cardVerified = await prisma.cardVerified.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CardVerifiedFindFirstArgs>(args?: SelectSubset<T, CardVerifiedFindFirstArgs<ExtArgs>>): Prisma__CardVerifiedClient<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CardVerified that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardVerifiedFindFirstOrThrowArgs} args - Arguments to find a CardVerified
     * @example
     * // Get one CardVerified
     * const cardVerified = await prisma.cardVerified.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CardVerifiedFindFirstOrThrowArgs>(args?: SelectSubset<T, CardVerifiedFindFirstOrThrowArgs<ExtArgs>>): Prisma__CardVerifiedClient<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CardVerifieds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardVerifiedFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CardVerifieds
     * const cardVerifieds = await prisma.cardVerified.findMany()
     * 
     * // Get first 10 CardVerifieds
     * const cardVerifieds = await prisma.cardVerified.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cardVerifiedWithIdOnly = await prisma.cardVerified.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CardVerifiedFindManyArgs>(args?: SelectSubset<T, CardVerifiedFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CardVerified.
     * @param {CardVerifiedCreateArgs} args - Arguments to create a CardVerified.
     * @example
     * // Create one CardVerified
     * const CardVerified = await prisma.cardVerified.create({
     *   data: {
     *     // ... data to create a CardVerified
     *   }
     * })
     * 
     */
    create<T extends CardVerifiedCreateArgs>(args: SelectSubset<T, CardVerifiedCreateArgs<ExtArgs>>): Prisma__CardVerifiedClient<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CardVerifieds.
     * @param {CardVerifiedCreateManyArgs} args - Arguments to create many CardVerifieds.
     * @example
     * // Create many CardVerifieds
     * const cardVerified = await prisma.cardVerified.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CardVerifiedCreateManyArgs>(args?: SelectSubset<T, CardVerifiedCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CardVerifieds and returns the data saved in the database.
     * @param {CardVerifiedCreateManyAndReturnArgs} args - Arguments to create many CardVerifieds.
     * @example
     * // Create many CardVerifieds
     * const cardVerified = await prisma.cardVerified.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CardVerifieds and only return the `id`
     * const cardVerifiedWithIdOnly = await prisma.cardVerified.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CardVerifiedCreateManyAndReturnArgs>(args?: SelectSubset<T, CardVerifiedCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CardVerified.
     * @param {CardVerifiedDeleteArgs} args - Arguments to delete one CardVerified.
     * @example
     * // Delete one CardVerified
     * const CardVerified = await prisma.cardVerified.delete({
     *   where: {
     *     // ... filter to delete one CardVerified
     *   }
     * })
     * 
     */
    delete<T extends CardVerifiedDeleteArgs>(args: SelectSubset<T, CardVerifiedDeleteArgs<ExtArgs>>): Prisma__CardVerifiedClient<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CardVerified.
     * @param {CardVerifiedUpdateArgs} args - Arguments to update one CardVerified.
     * @example
     * // Update one CardVerified
     * const cardVerified = await prisma.cardVerified.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CardVerifiedUpdateArgs>(args: SelectSubset<T, CardVerifiedUpdateArgs<ExtArgs>>): Prisma__CardVerifiedClient<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CardVerifieds.
     * @param {CardVerifiedDeleteManyArgs} args - Arguments to filter CardVerifieds to delete.
     * @example
     * // Delete a few CardVerifieds
     * const { count } = await prisma.cardVerified.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CardVerifiedDeleteManyArgs>(args?: SelectSubset<T, CardVerifiedDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CardVerifieds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardVerifiedUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CardVerifieds
     * const cardVerified = await prisma.cardVerified.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CardVerifiedUpdateManyArgs>(args: SelectSubset<T, CardVerifiedUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CardVerifieds and returns the data updated in the database.
     * @param {CardVerifiedUpdateManyAndReturnArgs} args - Arguments to update many CardVerifieds.
     * @example
     * // Update many CardVerifieds
     * const cardVerified = await prisma.cardVerified.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CardVerifieds and only return the `id`
     * const cardVerifiedWithIdOnly = await prisma.cardVerified.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CardVerifiedUpdateManyAndReturnArgs>(args: SelectSubset<T, CardVerifiedUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CardVerified.
     * @param {CardVerifiedUpsertArgs} args - Arguments to update or create a CardVerified.
     * @example
     * // Update or create a CardVerified
     * const cardVerified = await prisma.cardVerified.upsert({
     *   create: {
     *     // ... data to create a CardVerified
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CardVerified we want to update
     *   }
     * })
     */
    upsert<T extends CardVerifiedUpsertArgs>(args: SelectSubset<T, CardVerifiedUpsertArgs<ExtArgs>>): Prisma__CardVerifiedClient<$Result.GetResult<Prisma.$CardVerifiedPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CardVerifieds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardVerifiedCountArgs} args - Arguments to filter CardVerifieds to count.
     * @example
     * // Count the number of CardVerifieds
     * const count = await prisma.cardVerified.count({
     *   where: {
     *     // ... the filter for the CardVerifieds we want to count
     *   }
     * })
    **/
    count<T extends CardVerifiedCountArgs>(
      args?: Subset<T, CardVerifiedCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CardVerifiedCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CardVerified.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardVerifiedAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CardVerifiedAggregateArgs>(args: Subset<T, CardVerifiedAggregateArgs>): Prisma.PrismaPromise<GetCardVerifiedAggregateType<T>>

    /**
     * Group by CardVerified.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CardVerifiedGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CardVerifiedGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CardVerifiedGroupByArgs['orderBy'] }
        : { orderBy?: CardVerifiedGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CardVerifiedGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCardVerifiedGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CardVerified model
   */
  readonly fields: CardVerifiedFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CardVerified.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CardVerifiedClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CardVerified model
   */
  interface CardVerifiedFieldRefs {
    readonly id: FieldRef<"CardVerified", 'Int'>
    readonly verifiedcardnumbers: FieldRef<"CardVerified", 'String'>
    readonly ictreceived: FieldRef<"CardVerified", 'String'>
    readonly datereceived: FieldRef<"CardVerified", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CardVerified findUnique
   */
  export type CardVerifiedFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * Filter, which CardVerified to fetch.
     */
    where: CardVerifiedWhereUniqueInput
  }

  /**
   * CardVerified findUniqueOrThrow
   */
  export type CardVerifiedFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * Filter, which CardVerified to fetch.
     */
    where: CardVerifiedWhereUniqueInput
  }

  /**
   * CardVerified findFirst
   */
  export type CardVerifiedFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * Filter, which CardVerified to fetch.
     */
    where?: CardVerifiedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardVerifieds to fetch.
     */
    orderBy?: CardVerifiedOrderByWithRelationInput | CardVerifiedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CardVerifieds.
     */
    cursor?: CardVerifiedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardVerifieds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardVerifieds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CardVerifieds.
     */
    distinct?: CardVerifiedScalarFieldEnum | CardVerifiedScalarFieldEnum[]
  }

  /**
   * CardVerified findFirstOrThrow
   */
  export type CardVerifiedFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * Filter, which CardVerified to fetch.
     */
    where?: CardVerifiedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardVerifieds to fetch.
     */
    orderBy?: CardVerifiedOrderByWithRelationInput | CardVerifiedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CardVerifieds.
     */
    cursor?: CardVerifiedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardVerifieds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardVerifieds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CardVerifieds.
     */
    distinct?: CardVerifiedScalarFieldEnum | CardVerifiedScalarFieldEnum[]
  }

  /**
   * CardVerified findMany
   */
  export type CardVerifiedFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * Filter, which CardVerifieds to fetch.
     */
    where?: CardVerifiedWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CardVerifieds to fetch.
     */
    orderBy?: CardVerifiedOrderByWithRelationInput | CardVerifiedOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CardVerifieds.
     */
    cursor?: CardVerifiedWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CardVerifieds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CardVerifieds.
     */
    skip?: number
    distinct?: CardVerifiedScalarFieldEnum | CardVerifiedScalarFieldEnum[]
  }

  /**
   * CardVerified create
   */
  export type CardVerifiedCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * The data needed to create a CardVerified.
     */
    data: XOR<CardVerifiedCreateInput, CardVerifiedUncheckedCreateInput>
  }

  /**
   * CardVerified createMany
   */
  export type CardVerifiedCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CardVerifieds.
     */
    data: CardVerifiedCreateManyInput | CardVerifiedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CardVerified createManyAndReturn
   */
  export type CardVerifiedCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * The data used to create many CardVerifieds.
     */
    data: CardVerifiedCreateManyInput | CardVerifiedCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CardVerified update
   */
  export type CardVerifiedUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * The data needed to update a CardVerified.
     */
    data: XOR<CardVerifiedUpdateInput, CardVerifiedUncheckedUpdateInput>
    /**
     * Choose, which CardVerified to update.
     */
    where: CardVerifiedWhereUniqueInput
  }

  /**
   * CardVerified updateMany
   */
  export type CardVerifiedUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CardVerifieds.
     */
    data: XOR<CardVerifiedUpdateManyMutationInput, CardVerifiedUncheckedUpdateManyInput>
    /**
     * Filter which CardVerifieds to update
     */
    where?: CardVerifiedWhereInput
    /**
     * Limit how many CardVerifieds to update.
     */
    limit?: number
  }

  /**
   * CardVerified updateManyAndReturn
   */
  export type CardVerifiedUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * The data used to update CardVerifieds.
     */
    data: XOR<CardVerifiedUpdateManyMutationInput, CardVerifiedUncheckedUpdateManyInput>
    /**
     * Filter which CardVerifieds to update
     */
    where?: CardVerifiedWhereInput
    /**
     * Limit how many CardVerifieds to update.
     */
    limit?: number
  }

  /**
   * CardVerified upsert
   */
  export type CardVerifiedUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * The filter to search for the CardVerified to update in case it exists.
     */
    where: CardVerifiedWhereUniqueInput
    /**
     * In case the CardVerified found by the `where` argument doesn't exist, create a new CardVerified with this data.
     */
    create: XOR<CardVerifiedCreateInput, CardVerifiedUncheckedCreateInput>
    /**
     * In case the CardVerified was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CardVerifiedUpdateInput, CardVerifiedUncheckedUpdateInput>
  }

  /**
   * CardVerified delete
   */
  export type CardVerifiedDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
    /**
     * Filter which CardVerified to delete.
     */
    where: CardVerifiedWhereUniqueInput
  }

  /**
   * CardVerified deleteMany
   */
  export type CardVerifiedDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CardVerifieds to delete
     */
    where?: CardVerifiedWhereInput
    /**
     * Limit how many CardVerifieds to delete.
     */
    limit?: number
  }

  /**
   * CardVerified without action
   */
  export type CardVerifiedDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CardVerified
     */
    select?: CardVerifiedSelect<ExtArgs> | null
    /**
     * Omit specific fields from the CardVerified
     */
    omit?: CardVerifiedOmit<ExtArgs> | null
  }


  /**
   * Model CmsCompany
   */

  export type AggregateCmsCompany = {
    _count: CmsCompanyCountAggregateOutputType | null
    _avg: CmsCompanyAvgAggregateOutputType | null
    _sum: CmsCompanySumAggregateOutputType | null
    _min: CmsCompanyMinAggregateOutputType | null
    _max: CmsCompanyMaxAggregateOutputType | null
  }

  export type CmsCompanyAvgAggregateOutputType = {
    id: number | null
    idcompany: number | null
  }

  export type CmsCompanySumAggregateOutputType = {
    id: number | null
    idcompany: bigint | null
  }

  export type CmsCompanyMinAggregateOutputType = {
    id: number | null
    server: string | null
    idcompany: bigint | null
    code: string | null
    name: string | null
    status: string | null
    billingtype: string | null
  }

  export type CmsCompanyMaxAggregateOutputType = {
    id: number | null
    server: string | null
    idcompany: bigint | null
    code: string | null
    name: string | null
    status: string | null
    billingtype: string | null
  }

  export type CmsCompanyCountAggregateOutputType = {
    id: number
    server: number
    idcompany: number
    code: number
    name: number
    status: number
    billingtype: number
    _all: number
  }


  export type CmsCompanyAvgAggregateInputType = {
    id?: true
    idcompany?: true
  }

  export type CmsCompanySumAggregateInputType = {
    id?: true
    idcompany?: true
  }

  export type CmsCompanyMinAggregateInputType = {
    id?: true
    server?: true
    idcompany?: true
    code?: true
    name?: true
    status?: true
    billingtype?: true
  }

  export type CmsCompanyMaxAggregateInputType = {
    id?: true
    server?: true
    idcompany?: true
    code?: true
    name?: true
    status?: true
    billingtype?: true
  }

  export type CmsCompanyCountAggregateInputType = {
    id?: true
    server?: true
    idcompany?: true
    code?: true
    name?: true
    status?: true
    billingtype?: true
    _all?: true
  }

  export type CmsCompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CmsCompany to aggregate.
     */
    where?: CmsCompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CmsCompanies to fetch.
     */
    orderBy?: CmsCompanyOrderByWithRelationInput | CmsCompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CmsCompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CmsCompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CmsCompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CmsCompanies
    **/
    _count?: true | CmsCompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CmsCompanyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CmsCompanySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CmsCompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CmsCompanyMaxAggregateInputType
  }

  export type GetCmsCompanyAggregateType<T extends CmsCompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCmsCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCmsCompany[P]>
      : GetScalarType<T[P], AggregateCmsCompany[P]>
  }




  export type CmsCompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CmsCompanyWhereInput
    orderBy?: CmsCompanyOrderByWithAggregationInput | CmsCompanyOrderByWithAggregationInput[]
    by: CmsCompanyScalarFieldEnum[] | CmsCompanyScalarFieldEnum
    having?: CmsCompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CmsCompanyCountAggregateInputType | true
    _avg?: CmsCompanyAvgAggregateInputType
    _sum?: CmsCompanySumAggregateInputType
    _min?: CmsCompanyMinAggregateInputType
    _max?: CmsCompanyMaxAggregateInputType
  }

  export type CmsCompanyGroupByOutputType = {
    id: number
    server: string | null
    idcompany: bigint | null
    code: string | null
    name: string | null
    status: string | null
    billingtype: string | null
    _count: CmsCompanyCountAggregateOutputType | null
    _avg: CmsCompanyAvgAggregateOutputType | null
    _sum: CmsCompanySumAggregateOutputType | null
    _min: CmsCompanyMinAggregateOutputType | null
    _max: CmsCompanyMaxAggregateOutputType | null
  }

  type GetCmsCompanyGroupByPayload<T extends CmsCompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CmsCompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CmsCompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CmsCompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CmsCompanyGroupByOutputType[P]>
        }
      >
    >


  export type CmsCompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    server?: boolean
    idcompany?: boolean
    code?: boolean
    name?: boolean
    status?: boolean
    billingtype?: boolean
  }, ExtArgs["result"]["cmsCompany"]>

  export type CmsCompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    server?: boolean
    idcompany?: boolean
    code?: boolean
    name?: boolean
    status?: boolean
    billingtype?: boolean
  }, ExtArgs["result"]["cmsCompany"]>

  export type CmsCompanySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    server?: boolean
    idcompany?: boolean
    code?: boolean
    name?: boolean
    status?: boolean
    billingtype?: boolean
  }, ExtArgs["result"]["cmsCompany"]>

  export type CmsCompanySelectScalar = {
    id?: boolean
    server?: boolean
    idcompany?: boolean
    code?: boolean
    name?: boolean
    status?: boolean
    billingtype?: boolean
  }

  export type CmsCompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "server" | "idcompany" | "code" | "name" | "status" | "billingtype", ExtArgs["result"]["cmsCompany"]>

  export type $CmsCompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CmsCompany"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      server: string | null
      idcompany: bigint | null
      code: string | null
      name: string | null
      status: string | null
      billingtype: string | null
    }, ExtArgs["result"]["cmsCompany"]>
    composites: {}
  }

  type CmsCompanyGetPayload<S extends boolean | null | undefined | CmsCompanyDefaultArgs> = $Result.GetResult<Prisma.$CmsCompanyPayload, S>

  type CmsCompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CmsCompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CmsCompanyCountAggregateInputType | true
    }

  export interface CmsCompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CmsCompany'], meta: { name: 'CmsCompany' } }
    /**
     * Find zero or one CmsCompany that matches the filter.
     * @param {CmsCompanyFindUniqueArgs} args - Arguments to find a CmsCompany
     * @example
     * // Get one CmsCompany
     * const cmsCompany = await prisma.cmsCompany.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CmsCompanyFindUniqueArgs>(args: SelectSubset<T, CmsCompanyFindUniqueArgs<ExtArgs>>): Prisma__CmsCompanyClient<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one CmsCompany that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CmsCompanyFindUniqueOrThrowArgs} args - Arguments to find a CmsCompany
     * @example
     * // Get one CmsCompany
     * const cmsCompany = await prisma.cmsCompany.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CmsCompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CmsCompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CmsCompanyClient<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CmsCompany that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsCompanyFindFirstArgs} args - Arguments to find a CmsCompany
     * @example
     * // Get one CmsCompany
     * const cmsCompany = await prisma.cmsCompany.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CmsCompanyFindFirstArgs>(args?: SelectSubset<T, CmsCompanyFindFirstArgs<ExtArgs>>): Prisma__CmsCompanyClient<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first CmsCompany that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsCompanyFindFirstOrThrowArgs} args - Arguments to find a CmsCompany
     * @example
     * // Get one CmsCompany
     * const cmsCompany = await prisma.cmsCompany.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CmsCompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CmsCompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CmsCompanyClient<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more CmsCompanies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsCompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CmsCompanies
     * const cmsCompanies = await prisma.cmsCompany.findMany()
     * 
     * // Get first 10 CmsCompanies
     * const cmsCompanies = await prisma.cmsCompany.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const cmsCompanyWithIdOnly = await prisma.cmsCompany.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CmsCompanyFindManyArgs>(args?: SelectSubset<T, CmsCompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a CmsCompany.
     * @param {CmsCompanyCreateArgs} args - Arguments to create a CmsCompany.
     * @example
     * // Create one CmsCompany
     * const CmsCompany = await prisma.cmsCompany.create({
     *   data: {
     *     // ... data to create a CmsCompany
     *   }
     * })
     * 
     */
    create<T extends CmsCompanyCreateArgs>(args: SelectSubset<T, CmsCompanyCreateArgs<ExtArgs>>): Prisma__CmsCompanyClient<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many CmsCompanies.
     * @param {CmsCompanyCreateManyArgs} args - Arguments to create many CmsCompanies.
     * @example
     * // Create many CmsCompanies
     * const cmsCompany = await prisma.cmsCompany.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CmsCompanyCreateManyArgs>(args?: SelectSubset<T, CmsCompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CmsCompanies and returns the data saved in the database.
     * @param {CmsCompanyCreateManyAndReturnArgs} args - Arguments to create many CmsCompanies.
     * @example
     * // Create many CmsCompanies
     * const cmsCompany = await prisma.cmsCompany.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CmsCompanies and only return the `id`
     * const cmsCompanyWithIdOnly = await prisma.cmsCompany.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CmsCompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CmsCompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a CmsCompany.
     * @param {CmsCompanyDeleteArgs} args - Arguments to delete one CmsCompany.
     * @example
     * // Delete one CmsCompany
     * const CmsCompany = await prisma.cmsCompany.delete({
     *   where: {
     *     // ... filter to delete one CmsCompany
     *   }
     * })
     * 
     */
    delete<T extends CmsCompanyDeleteArgs>(args: SelectSubset<T, CmsCompanyDeleteArgs<ExtArgs>>): Prisma__CmsCompanyClient<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one CmsCompany.
     * @param {CmsCompanyUpdateArgs} args - Arguments to update one CmsCompany.
     * @example
     * // Update one CmsCompany
     * const cmsCompany = await prisma.cmsCompany.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CmsCompanyUpdateArgs>(args: SelectSubset<T, CmsCompanyUpdateArgs<ExtArgs>>): Prisma__CmsCompanyClient<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more CmsCompanies.
     * @param {CmsCompanyDeleteManyArgs} args - Arguments to filter CmsCompanies to delete.
     * @example
     * // Delete a few CmsCompanies
     * const { count } = await prisma.cmsCompany.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CmsCompanyDeleteManyArgs>(args?: SelectSubset<T, CmsCompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CmsCompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsCompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CmsCompanies
     * const cmsCompany = await prisma.cmsCompany.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CmsCompanyUpdateManyArgs>(args: SelectSubset<T, CmsCompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CmsCompanies and returns the data updated in the database.
     * @param {CmsCompanyUpdateManyAndReturnArgs} args - Arguments to update many CmsCompanies.
     * @example
     * // Update many CmsCompanies
     * const cmsCompany = await prisma.cmsCompany.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more CmsCompanies and only return the `id`
     * const cmsCompanyWithIdOnly = await prisma.cmsCompany.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CmsCompanyUpdateManyAndReturnArgs>(args: SelectSubset<T, CmsCompanyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one CmsCompany.
     * @param {CmsCompanyUpsertArgs} args - Arguments to update or create a CmsCompany.
     * @example
     * // Update or create a CmsCompany
     * const cmsCompany = await prisma.cmsCompany.upsert({
     *   create: {
     *     // ... data to create a CmsCompany
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CmsCompany we want to update
     *   }
     * })
     */
    upsert<T extends CmsCompanyUpsertArgs>(args: SelectSubset<T, CmsCompanyUpsertArgs<ExtArgs>>): Prisma__CmsCompanyClient<$Result.GetResult<Prisma.$CmsCompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of CmsCompanies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsCompanyCountArgs} args - Arguments to filter CmsCompanies to count.
     * @example
     * // Count the number of CmsCompanies
     * const count = await prisma.cmsCompany.count({
     *   where: {
     *     // ... the filter for the CmsCompanies we want to count
     *   }
     * })
    **/
    count<T extends CmsCompanyCountArgs>(
      args?: Subset<T, CmsCompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CmsCompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CmsCompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsCompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CmsCompanyAggregateArgs>(args: Subset<T, CmsCompanyAggregateArgs>): Prisma.PrismaPromise<GetCmsCompanyAggregateType<T>>

    /**
     * Group by CmsCompany.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CmsCompanyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CmsCompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CmsCompanyGroupByArgs['orderBy'] }
        : { orderBy?: CmsCompanyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CmsCompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCmsCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CmsCompany model
   */
  readonly fields: CmsCompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CmsCompany.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CmsCompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CmsCompany model
   */
  interface CmsCompanyFieldRefs {
    readonly id: FieldRef<"CmsCompany", 'Int'>
    readonly server: FieldRef<"CmsCompany", 'String'>
    readonly idcompany: FieldRef<"CmsCompany", 'BigInt'>
    readonly code: FieldRef<"CmsCompany", 'String'>
    readonly name: FieldRef<"CmsCompany", 'String'>
    readonly status: FieldRef<"CmsCompany", 'String'>
    readonly billingtype: FieldRef<"CmsCompany", 'String'>
  }
    

  // Custom InputTypes
  /**
   * CmsCompany findUnique
   */
  export type CmsCompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * Filter, which CmsCompany to fetch.
     */
    where: CmsCompanyWhereUniqueInput
  }

  /**
   * CmsCompany findUniqueOrThrow
   */
  export type CmsCompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * Filter, which CmsCompany to fetch.
     */
    where: CmsCompanyWhereUniqueInput
  }

  /**
   * CmsCompany findFirst
   */
  export type CmsCompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * Filter, which CmsCompany to fetch.
     */
    where?: CmsCompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CmsCompanies to fetch.
     */
    orderBy?: CmsCompanyOrderByWithRelationInput | CmsCompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CmsCompanies.
     */
    cursor?: CmsCompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CmsCompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CmsCompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CmsCompanies.
     */
    distinct?: CmsCompanyScalarFieldEnum | CmsCompanyScalarFieldEnum[]
  }

  /**
   * CmsCompany findFirstOrThrow
   */
  export type CmsCompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * Filter, which CmsCompany to fetch.
     */
    where?: CmsCompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CmsCompanies to fetch.
     */
    orderBy?: CmsCompanyOrderByWithRelationInput | CmsCompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CmsCompanies.
     */
    cursor?: CmsCompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CmsCompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CmsCompanies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CmsCompanies.
     */
    distinct?: CmsCompanyScalarFieldEnum | CmsCompanyScalarFieldEnum[]
  }

  /**
   * CmsCompany findMany
   */
  export type CmsCompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * Filter, which CmsCompanies to fetch.
     */
    where?: CmsCompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CmsCompanies to fetch.
     */
    orderBy?: CmsCompanyOrderByWithRelationInput | CmsCompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CmsCompanies.
     */
    cursor?: CmsCompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CmsCompanies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CmsCompanies.
     */
    skip?: number
    distinct?: CmsCompanyScalarFieldEnum | CmsCompanyScalarFieldEnum[]
  }

  /**
   * CmsCompany create
   */
  export type CmsCompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * The data needed to create a CmsCompany.
     */
    data?: XOR<CmsCompanyCreateInput, CmsCompanyUncheckedCreateInput>
  }

  /**
   * CmsCompany createMany
   */
  export type CmsCompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CmsCompanies.
     */
    data: CmsCompanyCreateManyInput | CmsCompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CmsCompany createManyAndReturn
   */
  export type CmsCompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * The data used to create many CmsCompanies.
     */
    data: CmsCompanyCreateManyInput | CmsCompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CmsCompany update
   */
  export type CmsCompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * The data needed to update a CmsCompany.
     */
    data: XOR<CmsCompanyUpdateInput, CmsCompanyUncheckedUpdateInput>
    /**
     * Choose, which CmsCompany to update.
     */
    where: CmsCompanyWhereUniqueInput
  }

  /**
   * CmsCompany updateMany
   */
  export type CmsCompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CmsCompanies.
     */
    data: XOR<CmsCompanyUpdateManyMutationInput, CmsCompanyUncheckedUpdateManyInput>
    /**
     * Filter which CmsCompanies to update
     */
    where?: CmsCompanyWhereInput
    /**
     * Limit how many CmsCompanies to update.
     */
    limit?: number
  }

  /**
   * CmsCompany updateManyAndReturn
   */
  export type CmsCompanyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * The data used to update CmsCompanies.
     */
    data: XOR<CmsCompanyUpdateManyMutationInput, CmsCompanyUncheckedUpdateManyInput>
    /**
     * Filter which CmsCompanies to update
     */
    where?: CmsCompanyWhereInput
    /**
     * Limit how many CmsCompanies to update.
     */
    limit?: number
  }

  /**
   * CmsCompany upsert
   */
  export type CmsCompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * The filter to search for the CmsCompany to update in case it exists.
     */
    where: CmsCompanyWhereUniqueInput
    /**
     * In case the CmsCompany found by the `where` argument doesn't exist, create a new CmsCompany with this data.
     */
    create: XOR<CmsCompanyCreateInput, CmsCompanyUncheckedCreateInput>
    /**
     * In case the CmsCompany was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CmsCompanyUpdateInput, CmsCompanyUncheckedUpdateInput>
  }

  /**
   * CmsCompany delete
   */
  export type CmsCompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
    /**
     * Filter which CmsCompany to delete.
     */
    where: CmsCompanyWhereUniqueInput
  }

  /**
   * CmsCompany deleteMany
   */
  export type CmsCompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CmsCompanies to delete
     */
    where?: CmsCompanyWhereInput
    /**
     * Limit how many CmsCompanies to delete.
     */
    limit?: number
  }

  /**
   * CmsCompany without action
   */
  export type CmsCompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CmsCompany
     */
    select?: CmsCompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the CmsCompany
     */
    omit?: CmsCompanyOmit<ExtArgs> | null
  }


  /**
   * Model ConsultationNote
   */

  export type AggregateConsultationNote = {
    _count: ConsultationNoteCountAggregateOutputType | null
    _avg: ConsultationNoteAvgAggregateOutputType | null
    _sum: ConsultationNoteSumAggregateOutputType | null
    _min: ConsultationNoteMinAggregateOutputType | null
    _max: ConsultationNoteMaxAggregateOutputType | null
  }

  export type ConsultationNoteAvgAggregateOutputType = {
    id: number | null
    queue_id: number | null
    is_draft: number | null
    doctor_id: number | null
    recorded_by: number | null
  }

  export type ConsultationNoteSumAggregateOutputType = {
    id: number | null
    queue_id: number | null
    is_draft: number | null
    doctor_id: number | null
    recorded_by: number | null
  }

  export type ConsultationNoteMinAggregateOutputType = {
    id: number | null
    queue_id: number | null
    patient_id: string | null
    status: string | null
    is_draft: number | null
    chief_complaint: string | null
    history_illness: string | null
    past_history: string | null
    family_history: string | null
    pe_findings: string | null
    diagnosis: string | null
    icd_code: string | null
    treatment_plan: string | null
    orders: string | null
    pcp_doctor: string | null
    doctor_id: number | null
    doctor_name: string | null
    recorded_by: number | null
    completed_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ConsultationNoteMaxAggregateOutputType = {
    id: number | null
    queue_id: number | null
    patient_id: string | null
    status: string | null
    is_draft: number | null
    chief_complaint: string | null
    history_illness: string | null
    past_history: string | null
    family_history: string | null
    pe_findings: string | null
    diagnosis: string | null
    icd_code: string | null
    treatment_plan: string | null
    orders: string | null
    pcp_doctor: string | null
    doctor_id: number | null
    doctor_name: string | null
    recorded_by: number | null
    completed_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ConsultationNoteCountAggregateOutputType = {
    id: number
    queue_id: number
    patient_id: number
    status: number
    is_draft: number
    chief_complaint: number
    history_illness: number
    past_history: number
    family_history: number
    pe_findings: number
    diagnosis: number
    icd_code: number
    treatment_plan: number
    orders: number
    pcp_doctor: number
    doctor_id: number
    doctor_name: number
    recorded_by: number
    completed_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ConsultationNoteAvgAggregateInputType = {
    id?: true
    queue_id?: true
    is_draft?: true
    doctor_id?: true
    recorded_by?: true
  }

  export type ConsultationNoteSumAggregateInputType = {
    id?: true
    queue_id?: true
    is_draft?: true
    doctor_id?: true
    recorded_by?: true
  }

  export type ConsultationNoteMinAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    status?: true
    is_draft?: true
    chief_complaint?: true
    history_illness?: true
    past_history?: true
    family_history?: true
    pe_findings?: true
    diagnosis?: true
    icd_code?: true
    treatment_plan?: true
    orders?: true
    pcp_doctor?: true
    doctor_id?: true
    doctor_name?: true
    recorded_by?: true
    completed_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ConsultationNoteMaxAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    status?: true
    is_draft?: true
    chief_complaint?: true
    history_illness?: true
    past_history?: true
    family_history?: true
    pe_findings?: true
    diagnosis?: true
    icd_code?: true
    treatment_plan?: true
    orders?: true
    pcp_doctor?: true
    doctor_id?: true
    doctor_name?: true
    recorded_by?: true
    completed_at?: true
    created_at?: true
    updated_at?: true
  }

  export type ConsultationNoteCountAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    status?: true
    is_draft?: true
    chief_complaint?: true
    history_illness?: true
    past_history?: true
    family_history?: true
    pe_findings?: true
    diagnosis?: true
    icd_code?: true
    treatment_plan?: true
    orders?: true
    pcp_doctor?: true
    doctor_id?: true
    doctor_name?: true
    recorded_by?: true
    completed_at?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ConsultationNoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsultationNote to aggregate.
     */
    where?: ConsultationNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsultationNotes to fetch.
     */
    orderBy?: ConsultationNoteOrderByWithRelationInput | ConsultationNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConsultationNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsultationNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsultationNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConsultationNotes
    **/
    _count?: true | ConsultationNoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ConsultationNoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ConsultationNoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConsultationNoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConsultationNoteMaxAggregateInputType
  }

  export type GetConsultationNoteAggregateType<T extends ConsultationNoteAggregateArgs> = {
        [P in keyof T & keyof AggregateConsultationNote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConsultationNote[P]>
      : GetScalarType<T[P], AggregateConsultationNote[P]>
  }




  export type ConsultationNoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConsultationNoteWhereInput
    orderBy?: ConsultationNoteOrderByWithAggregationInput | ConsultationNoteOrderByWithAggregationInput[]
    by: ConsultationNoteScalarFieldEnum[] | ConsultationNoteScalarFieldEnum
    having?: ConsultationNoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConsultationNoteCountAggregateInputType | true
    _avg?: ConsultationNoteAvgAggregateInputType
    _sum?: ConsultationNoteSumAggregateInputType
    _min?: ConsultationNoteMinAggregateInputType
    _max?: ConsultationNoteMaxAggregateInputType
  }

  export type ConsultationNoteGroupByOutputType = {
    id: number
    queue_id: number
    patient_id: string
    status: string
    is_draft: number
    chief_complaint: string | null
    history_illness: string | null
    past_history: string | null
    family_history: string | null
    pe_findings: string | null
    diagnosis: string | null
    icd_code: string | null
    treatment_plan: string | null
    orders: string | null
    pcp_doctor: string | null
    doctor_id: number | null
    doctor_name: string | null
    recorded_by: number | null
    completed_at: Date | null
    created_at: Date
    updated_at: Date
    _count: ConsultationNoteCountAggregateOutputType | null
    _avg: ConsultationNoteAvgAggregateOutputType | null
    _sum: ConsultationNoteSumAggregateOutputType | null
    _min: ConsultationNoteMinAggregateOutputType | null
    _max: ConsultationNoteMaxAggregateOutputType | null
  }

  type GetConsultationNoteGroupByPayload<T extends ConsultationNoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConsultationNoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConsultationNoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConsultationNoteGroupByOutputType[P]>
            : GetScalarType<T[P], ConsultationNoteGroupByOutputType[P]>
        }
      >
    >


  export type ConsultationNoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    status?: boolean
    is_draft?: boolean
    chief_complaint?: boolean
    history_illness?: boolean
    past_history?: boolean
    family_history?: boolean
    pe_findings?: boolean
    diagnosis?: boolean
    icd_code?: boolean
    treatment_plan?: boolean
    orders?: boolean
    pcp_doctor?: boolean
    doctor_id?: boolean
    doctor_name?: boolean
    recorded_by?: boolean
    completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["consultationNote"]>

  export type ConsultationNoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    status?: boolean
    is_draft?: boolean
    chief_complaint?: boolean
    history_illness?: boolean
    past_history?: boolean
    family_history?: boolean
    pe_findings?: boolean
    diagnosis?: boolean
    icd_code?: boolean
    treatment_plan?: boolean
    orders?: boolean
    pcp_doctor?: boolean
    doctor_id?: boolean
    doctor_name?: boolean
    recorded_by?: boolean
    completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["consultationNote"]>

  export type ConsultationNoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    status?: boolean
    is_draft?: boolean
    chief_complaint?: boolean
    history_illness?: boolean
    past_history?: boolean
    family_history?: boolean
    pe_findings?: boolean
    diagnosis?: boolean
    icd_code?: boolean
    treatment_plan?: boolean
    orders?: boolean
    pcp_doctor?: boolean
    doctor_id?: boolean
    doctor_name?: boolean
    recorded_by?: boolean
    completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["consultationNote"]>

  export type ConsultationNoteSelectScalar = {
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    status?: boolean
    is_draft?: boolean
    chief_complaint?: boolean
    history_illness?: boolean
    past_history?: boolean
    family_history?: boolean
    pe_findings?: boolean
    diagnosis?: boolean
    icd_code?: boolean
    treatment_plan?: boolean
    orders?: boolean
    pcp_doctor?: boolean
    doctor_id?: boolean
    doctor_name?: boolean
    recorded_by?: boolean
    completed_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ConsultationNoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "queue_id" | "patient_id" | "status" | "is_draft" | "chief_complaint" | "history_illness" | "past_history" | "family_history" | "pe_findings" | "diagnosis" | "icd_code" | "treatment_plan" | "orders" | "pcp_doctor" | "doctor_id" | "doctor_name" | "recorded_by" | "completed_at" | "created_at" | "updated_at", ExtArgs["result"]["consultationNote"]>

  export type $ConsultationNotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConsultationNote"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      queue_id: number
      patient_id: string
      status: string
      is_draft: number
      chief_complaint: string | null
      history_illness: string | null
      past_history: string | null
      family_history: string | null
      pe_findings: string | null
      diagnosis: string | null
      icd_code: string | null
      treatment_plan: string | null
      orders: string | null
      pcp_doctor: string | null
      doctor_id: number | null
      doctor_name: string | null
      recorded_by: number | null
      completed_at: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["consultationNote"]>
    composites: {}
  }

  type ConsultationNoteGetPayload<S extends boolean | null | undefined | ConsultationNoteDefaultArgs> = $Result.GetResult<Prisma.$ConsultationNotePayload, S>

  type ConsultationNoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConsultationNoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConsultationNoteCountAggregateInputType | true
    }

  export interface ConsultationNoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConsultationNote'], meta: { name: 'ConsultationNote' } }
    /**
     * Find zero or one ConsultationNote that matches the filter.
     * @param {ConsultationNoteFindUniqueArgs} args - Arguments to find a ConsultationNote
     * @example
     * // Get one ConsultationNote
     * const consultationNote = await prisma.consultationNote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConsultationNoteFindUniqueArgs>(args: SelectSubset<T, ConsultationNoteFindUniqueArgs<ExtArgs>>): Prisma__ConsultationNoteClient<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ConsultationNote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConsultationNoteFindUniqueOrThrowArgs} args - Arguments to find a ConsultationNote
     * @example
     * // Get one ConsultationNote
     * const consultationNote = await prisma.consultationNote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConsultationNoteFindUniqueOrThrowArgs>(args: SelectSubset<T, ConsultationNoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConsultationNoteClient<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConsultationNote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultationNoteFindFirstArgs} args - Arguments to find a ConsultationNote
     * @example
     * // Get one ConsultationNote
     * const consultationNote = await prisma.consultationNote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConsultationNoteFindFirstArgs>(args?: SelectSubset<T, ConsultationNoteFindFirstArgs<ExtArgs>>): Prisma__ConsultationNoteClient<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ConsultationNote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultationNoteFindFirstOrThrowArgs} args - Arguments to find a ConsultationNote
     * @example
     * // Get one ConsultationNote
     * const consultationNote = await prisma.consultationNote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConsultationNoteFindFirstOrThrowArgs>(args?: SelectSubset<T, ConsultationNoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConsultationNoteClient<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ConsultationNotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultationNoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConsultationNotes
     * const consultationNotes = await prisma.consultationNote.findMany()
     * 
     * // Get first 10 ConsultationNotes
     * const consultationNotes = await prisma.consultationNote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const consultationNoteWithIdOnly = await prisma.consultationNote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConsultationNoteFindManyArgs>(args?: SelectSubset<T, ConsultationNoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ConsultationNote.
     * @param {ConsultationNoteCreateArgs} args - Arguments to create a ConsultationNote.
     * @example
     * // Create one ConsultationNote
     * const ConsultationNote = await prisma.consultationNote.create({
     *   data: {
     *     // ... data to create a ConsultationNote
     *   }
     * })
     * 
     */
    create<T extends ConsultationNoteCreateArgs>(args: SelectSubset<T, ConsultationNoteCreateArgs<ExtArgs>>): Prisma__ConsultationNoteClient<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ConsultationNotes.
     * @param {ConsultationNoteCreateManyArgs} args - Arguments to create many ConsultationNotes.
     * @example
     * // Create many ConsultationNotes
     * const consultationNote = await prisma.consultationNote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConsultationNoteCreateManyArgs>(args?: SelectSubset<T, ConsultationNoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConsultationNotes and returns the data saved in the database.
     * @param {ConsultationNoteCreateManyAndReturnArgs} args - Arguments to create many ConsultationNotes.
     * @example
     * // Create many ConsultationNotes
     * const consultationNote = await prisma.consultationNote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConsultationNotes and only return the `id`
     * const consultationNoteWithIdOnly = await prisma.consultationNote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConsultationNoteCreateManyAndReturnArgs>(args?: SelectSubset<T, ConsultationNoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ConsultationNote.
     * @param {ConsultationNoteDeleteArgs} args - Arguments to delete one ConsultationNote.
     * @example
     * // Delete one ConsultationNote
     * const ConsultationNote = await prisma.consultationNote.delete({
     *   where: {
     *     // ... filter to delete one ConsultationNote
     *   }
     * })
     * 
     */
    delete<T extends ConsultationNoteDeleteArgs>(args: SelectSubset<T, ConsultationNoteDeleteArgs<ExtArgs>>): Prisma__ConsultationNoteClient<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ConsultationNote.
     * @param {ConsultationNoteUpdateArgs} args - Arguments to update one ConsultationNote.
     * @example
     * // Update one ConsultationNote
     * const consultationNote = await prisma.consultationNote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConsultationNoteUpdateArgs>(args: SelectSubset<T, ConsultationNoteUpdateArgs<ExtArgs>>): Prisma__ConsultationNoteClient<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ConsultationNotes.
     * @param {ConsultationNoteDeleteManyArgs} args - Arguments to filter ConsultationNotes to delete.
     * @example
     * // Delete a few ConsultationNotes
     * const { count } = await prisma.consultationNote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConsultationNoteDeleteManyArgs>(args?: SelectSubset<T, ConsultationNoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsultationNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultationNoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConsultationNotes
     * const consultationNote = await prisma.consultationNote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConsultationNoteUpdateManyArgs>(args: SelectSubset<T, ConsultationNoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConsultationNotes and returns the data updated in the database.
     * @param {ConsultationNoteUpdateManyAndReturnArgs} args - Arguments to update many ConsultationNotes.
     * @example
     * // Update many ConsultationNotes
     * const consultationNote = await prisma.consultationNote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ConsultationNotes and only return the `id`
     * const consultationNoteWithIdOnly = await prisma.consultationNote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConsultationNoteUpdateManyAndReturnArgs>(args: SelectSubset<T, ConsultationNoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ConsultationNote.
     * @param {ConsultationNoteUpsertArgs} args - Arguments to update or create a ConsultationNote.
     * @example
     * // Update or create a ConsultationNote
     * const consultationNote = await prisma.consultationNote.upsert({
     *   create: {
     *     // ... data to create a ConsultationNote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConsultationNote we want to update
     *   }
     * })
     */
    upsert<T extends ConsultationNoteUpsertArgs>(args: SelectSubset<T, ConsultationNoteUpsertArgs<ExtArgs>>): Prisma__ConsultationNoteClient<$Result.GetResult<Prisma.$ConsultationNotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ConsultationNotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultationNoteCountArgs} args - Arguments to filter ConsultationNotes to count.
     * @example
     * // Count the number of ConsultationNotes
     * const count = await prisma.consultationNote.count({
     *   where: {
     *     // ... the filter for the ConsultationNotes we want to count
     *   }
     * })
    **/
    count<T extends ConsultationNoteCountArgs>(
      args?: Subset<T, ConsultationNoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConsultationNoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConsultationNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultationNoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConsultationNoteAggregateArgs>(args: Subset<T, ConsultationNoteAggregateArgs>): Prisma.PrismaPromise<GetConsultationNoteAggregateType<T>>

    /**
     * Group by ConsultationNote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConsultationNoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConsultationNoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConsultationNoteGroupByArgs['orderBy'] }
        : { orderBy?: ConsultationNoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConsultationNoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConsultationNoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConsultationNote model
   */
  readonly fields: ConsultationNoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConsultationNote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConsultationNoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConsultationNote model
   */
  interface ConsultationNoteFieldRefs {
    readonly id: FieldRef<"ConsultationNote", 'Int'>
    readonly queue_id: FieldRef<"ConsultationNote", 'Int'>
    readonly patient_id: FieldRef<"ConsultationNote", 'String'>
    readonly status: FieldRef<"ConsultationNote", 'String'>
    readonly is_draft: FieldRef<"ConsultationNote", 'Int'>
    readonly chief_complaint: FieldRef<"ConsultationNote", 'String'>
    readonly history_illness: FieldRef<"ConsultationNote", 'String'>
    readonly past_history: FieldRef<"ConsultationNote", 'String'>
    readonly family_history: FieldRef<"ConsultationNote", 'String'>
    readonly pe_findings: FieldRef<"ConsultationNote", 'String'>
    readonly diagnosis: FieldRef<"ConsultationNote", 'String'>
    readonly icd_code: FieldRef<"ConsultationNote", 'String'>
    readonly treatment_plan: FieldRef<"ConsultationNote", 'String'>
    readonly orders: FieldRef<"ConsultationNote", 'String'>
    readonly pcp_doctor: FieldRef<"ConsultationNote", 'String'>
    readonly doctor_id: FieldRef<"ConsultationNote", 'Int'>
    readonly doctor_name: FieldRef<"ConsultationNote", 'String'>
    readonly recorded_by: FieldRef<"ConsultationNote", 'Int'>
    readonly completed_at: FieldRef<"ConsultationNote", 'DateTime'>
    readonly created_at: FieldRef<"ConsultationNote", 'DateTime'>
    readonly updated_at: FieldRef<"ConsultationNote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConsultationNote findUnique
   */
  export type ConsultationNoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * Filter, which ConsultationNote to fetch.
     */
    where: ConsultationNoteWhereUniqueInput
  }

  /**
   * ConsultationNote findUniqueOrThrow
   */
  export type ConsultationNoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * Filter, which ConsultationNote to fetch.
     */
    where: ConsultationNoteWhereUniqueInput
  }

  /**
   * ConsultationNote findFirst
   */
  export type ConsultationNoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * Filter, which ConsultationNote to fetch.
     */
    where?: ConsultationNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsultationNotes to fetch.
     */
    orderBy?: ConsultationNoteOrderByWithRelationInput | ConsultationNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsultationNotes.
     */
    cursor?: ConsultationNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsultationNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsultationNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsultationNotes.
     */
    distinct?: ConsultationNoteScalarFieldEnum | ConsultationNoteScalarFieldEnum[]
  }

  /**
   * ConsultationNote findFirstOrThrow
   */
  export type ConsultationNoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * Filter, which ConsultationNote to fetch.
     */
    where?: ConsultationNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsultationNotes to fetch.
     */
    orderBy?: ConsultationNoteOrderByWithRelationInput | ConsultationNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConsultationNotes.
     */
    cursor?: ConsultationNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsultationNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsultationNotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConsultationNotes.
     */
    distinct?: ConsultationNoteScalarFieldEnum | ConsultationNoteScalarFieldEnum[]
  }

  /**
   * ConsultationNote findMany
   */
  export type ConsultationNoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * Filter, which ConsultationNotes to fetch.
     */
    where?: ConsultationNoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConsultationNotes to fetch.
     */
    orderBy?: ConsultationNoteOrderByWithRelationInput | ConsultationNoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConsultationNotes.
     */
    cursor?: ConsultationNoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConsultationNotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConsultationNotes.
     */
    skip?: number
    distinct?: ConsultationNoteScalarFieldEnum | ConsultationNoteScalarFieldEnum[]
  }

  /**
   * ConsultationNote create
   */
  export type ConsultationNoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * The data needed to create a ConsultationNote.
     */
    data: XOR<ConsultationNoteCreateInput, ConsultationNoteUncheckedCreateInput>
  }

  /**
   * ConsultationNote createMany
   */
  export type ConsultationNoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConsultationNotes.
     */
    data: ConsultationNoteCreateManyInput | ConsultationNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsultationNote createManyAndReturn
   */
  export type ConsultationNoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * The data used to create many ConsultationNotes.
     */
    data: ConsultationNoteCreateManyInput | ConsultationNoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConsultationNote update
   */
  export type ConsultationNoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * The data needed to update a ConsultationNote.
     */
    data: XOR<ConsultationNoteUpdateInput, ConsultationNoteUncheckedUpdateInput>
    /**
     * Choose, which ConsultationNote to update.
     */
    where: ConsultationNoteWhereUniqueInput
  }

  /**
   * ConsultationNote updateMany
   */
  export type ConsultationNoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConsultationNotes.
     */
    data: XOR<ConsultationNoteUpdateManyMutationInput, ConsultationNoteUncheckedUpdateManyInput>
    /**
     * Filter which ConsultationNotes to update
     */
    where?: ConsultationNoteWhereInput
    /**
     * Limit how many ConsultationNotes to update.
     */
    limit?: number
  }

  /**
   * ConsultationNote updateManyAndReturn
   */
  export type ConsultationNoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * The data used to update ConsultationNotes.
     */
    data: XOR<ConsultationNoteUpdateManyMutationInput, ConsultationNoteUncheckedUpdateManyInput>
    /**
     * Filter which ConsultationNotes to update
     */
    where?: ConsultationNoteWhereInput
    /**
     * Limit how many ConsultationNotes to update.
     */
    limit?: number
  }

  /**
   * ConsultationNote upsert
   */
  export type ConsultationNoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * The filter to search for the ConsultationNote to update in case it exists.
     */
    where: ConsultationNoteWhereUniqueInput
    /**
     * In case the ConsultationNote found by the `where` argument doesn't exist, create a new ConsultationNote with this data.
     */
    create: XOR<ConsultationNoteCreateInput, ConsultationNoteUncheckedCreateInput>
    /**
     * In case the ConsultationNote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConsultationNoteUpdateInput, ConsultationNoteUncheckedUpdateInput>
  }

  /**
   * ConsultationNote delete
   */
  export type ConsultationNoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
    /**
     * Filter which ConsultationNote to delete.
     */
    where: ConsultationNoteWhereUniqueInput
  }

  /**
   * ConsultationNote deleteMany
   */
  export type ConsultationNoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConsultationNotes to delete
     */
    where?: ConsultationNoteWhereInput
    /**
     * Limit how many ConsultationNotes to delete.
     */
    limit?: number
  }

  /**
   * ConsultationNote without action
   */
  export type ConsultationNoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConsultationNote
     */
    select?: ConsultationNoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ConsultationNote
     */
    omit?: ConsultationNoteOmit<ExtArgs> | null
  }


  /**
   * Model Vitals
   */

  export type AggregateVitals = {
    _count: VitalsCountAggregateOutputType | null
    _avg: VitalsAvgAggregateOutputType | null
    _sum: VitalsSumAggregateOutputType | null
    _min: VitalsMinAggregateOutputType | null
    _max: VitalsMaxAggregateOutputType | null
  }

  export type VitalsAvgAggregateOutputType = {
    id: number | null
    queue_id: number | null
    bp_systolic: number | null
    bp_diastolic: number | null
    bp_systolic2: number | null
    bp_diastolic2: number | null
    bp_systolic3: number | null
    bp_diastolic3: number | null
    heart_rate: number | null
    temperature: number | null
    respiratory_rate: number | null
    o2_saturation: number | null
    weight_kg: number | null
    height_cm: number | null
    bmi: number | null
    recorded_by: number | null
  }

  export type VitalsSumAggregateOutputType = {
    id: number | null
    queue_id: number | null
    bp_systolic: number | null
    bp_diastolic: number | null
    bp_systolic2: number | null
    bp_diastolic2: number | null
    bp_systolic3: number | null
    bp_diastolic3: number | null
    heart_rate: number | null
    temperature: number | null
    respiratory_rate: number | null
    o2_saturation: number | null
    weight_kg: number | null
    height_cm: number | null
    bmi: number | null
    recorded_by: number | null
  }

  export type VitalsMinAggregateOutputType = {
    id: number | null
    queue_id: number | null
    patient_id: string | null
    bp_systolic: number | null
    bp_diastolic: number | null
    bp_systolic2: number | null
    bp_diastolic2: number | null
    bp_systolic3: number | null
    bp_diastolic3: number | null
    heart_rate: number | null
    temperature: number | null
    respiratory_rate: number | null
    o2_saturation: number | null
    weight_kg: number | null
    height_cm: number | null
    bmi: number | null
    vision_right_od: string | null
    vision_left_os: string | null
    vision_corrected: string | null
    color_vision: string | null
    chief_complaint: string | null
    pcp_doctor: string | null
    recorded_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type VitalsMaxAggregateOutputType = {
    id: number | null
    queue_id: number | null
    patient_id: string | null
    bp_systolic: number | null
    bp_diastolic: number | null
    bp_systolic2: number | null
    bp_diastolic2: number | null
    bp_systolic3: number | null
    bp_diastolic3: number | null
    heart_rate: number | null
    temperature: number | null
    respiratory_rate: number | null
    o2_saturation: number | null
    weight_kg: number | null
    height_cm: number | null
    bmi: number | null
    vision_right_od: string | null
    vision_left_os: string | null
    vision_corrected: string | null
    color_vision: string | null
    chief_complaint: string | null
    pcp_doctor: string | null
    recorded_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type VitalsCountAggregateOutputType = {
    id: number
    queue_id: number
    patient_id: number
    bp_systolic: number
    bp_diastolic: number
    bp_systolic2: number
    bp_diastolic2: number
    bp_systolic3: number
    bp_diastolic3: number
    heart_rate: number
    temperature: number
    respiratory_rate: number
    o2_saturation: number
    weight_kg: number
    height_cm: number
    bmi: number
    vision_right_od: number
    vision_left_os: number
    vision_corrected: number
    color_vision: number
    chief_complaint: number
    pcp_doctor: number
    recorded_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type VitalsAvgAggregateInputType = {
    id?: true
    queue_id?: true
    bp_systolic?: true
    bp_diastolic?: true
    bp_systolic2?: true
    bp_diastolic2?: true
    bp_systolic3?: true
    bp_diastolic3?: true
    heart_rate?: true
    temperature?: true
    respiratory_rate?: true
    o2_saturation?: true
    weight_kg?: true
    height_cm?: true
    bmi?: true
    recorded_by?: true
  }

  export type VitalsSumAggregateInputType = {
    id?: true
    queue_id?: true
    bp_systolic?: true
    bp_diastolic?: true
    bp_systolic2?: true
    bp_diastolic2?: true
    bp_systolic3?: true
    bp_diastolic3?: true
    heart_rate?: true
    temperature?: true
    respiratory_rate?: true
    o2_saturation?: true
    weight_kg?: true
    height_cm?: true
    bmi?: true
    recorded_by?: true
  }

  export type VitalsMinAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    bp_systolic?: true
    bp_diastolic?: true
    bp_systolic2?: true
    bp_diastolic2?: true
    bp_systolic3?: true
    bp_diastolic3?: true
    heart_rate?: true
    temperature?: true
    respiratory_rate?: true
    o2_saturation?: true
    weight_kg?: true
    height_cm?: true
    bmi?: true
    vision_right_od?: true
    vision_left_os?: true
    vision_corrected?: true
    color_vision?: true
    chief_complaint?: true
    pcp_doctor?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
  }

  export type VitalsMaxAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    bp_systolic?: true
    bp_diastolic?: true
    bp_systolic2?: true
    bp_diastolic2?: true
    bp_systolic3?: true
    bp_diastolic3?: true
    heart_rate?: true
    temperature?: true
    respiratory_rate?: true
    o2_saturation?: true
    weight_kg?: true
    height_cm?: true
    bmi?: true
    vision_right_od?: true
    vision_left_os?: true
    vision_corrected?: true
    color_vision?: true
    chief_complaint?: true
    pcp_doctor?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
  }

  export type VitalsCountAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    bp_systolic?: true
    bp_diastolic?: true
    bp_systolic2?: true
    bp_diastolic2?: true
    bp_systolic3?: true
    bp_diastolic3?: true
    heart_rate?: true
    temperature?: true
    respiratory_rate?: true
    o2_saturation?: true
    weight_kg?: true
    height_cm?: true
    bmi?: true
    vision_right_od?: true
    vision_left_os?: true
    vision_corrected?: true
    color_vision?: true
    chief_complaint?: true
    pcp_doctor?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type VitalsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vitals to aggregate.
     */
    where?: VitalsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vitals to fetch.
     */
    orderBy?: VitalsOrderByWithRelationInput | VitalsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VitalsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vitals
    **/
    _count?: true | VitalsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VitalsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VitalsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VitalsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VitalsMaxAggregateInputType
  }

  export type GetVitalsAggregateType<T extends VitalsAggregateArgs> = {
        [P in keyof T & keyof AggregateVitals]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVitals[P]>
      : GetScalarType<T[P], AggregateVitals[P]>
  }




  export type VitalsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VitalsWhereInput
    orderBy?: VitalsOrderByWithAggregationInput | VitalsOrderByWithAggregationInput[]
    by: VitalsScalarFieldEnum[] | VitalsScalarFieldEnum
    having?: VitalsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VitalsCountAggregateInputType | true
    _avg?: VitalsAvgAggregateInputType
    _sum?: VitalsSumAggregateInputType
    _min?: VitalsMinAggregateInputType
    _max?: VitalsMaxAggregateInputType
  }

  export type VitalsGroupByOutputType = {
    id: number
    queue_id: number
    patient_id: string | null
    bp_systolic: number | null
    bp_diastolic: number | null
    bp_systolic2: number | null
    bp_diastolic2: number | null
    bp_systolic3: number | null
    bp_diastolic3: number | null
    heart_rate: number | null
    temperature: number | null
    respiratory_rate: number | null
    o2_saturation: number | null
    weight_kg: number | null
    height_cm: number | null
    bmi: number | null
    vision_right_od: string | null
    vision_left_os: string | null
    vision_corrected: string | null
    color_vision: string | null
    chief_complaint: string | null
    pcp_doctor: string | null
    recorded_by: number | null
    created_at: Date
    updated_at: Date
    _count: VitalsCountAggregateOutputType | null
    _avg: VitalsAvgAggregateOutputType | null
    _sum: VitalsSumAggregateOutputType | null
    _min: VitalsMinAggregateOutputType | null
    _max: VitalsMaxAggregateOutputType | null
  }

  type GetVitalsGroupByPayload<T extends VitalsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VitalsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VitalsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VitalsGroupByOutputType[P]>
            : GetScalarType<T[P], VitalsGroupByOutputType[P]>
        }
      >
    >


  export type VitalsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    bp_systolic?: boolean
    bp_diastolic?: boolean
    bp_systolic2?: boolean
    bp_diastolic2?: boolean
    bp_systolic3?: boolean
    bp_diastolic3?: boolean
    heart_rate?: boolean
    temperature?: boolean
    respiratory_rate?: boolean
    o2_saturation?: boolean
    weight_kg?: boolean
    height_cm?: boolean
    bmi?: boolean
    vision_right_od?: boolean
    vision_left_os?: boolean
    vision_corrected?: boolean
    color_vision?: boolean
    chief_complaint?: boolean
    pcp_doctor?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["vitals"]>

  export type VitalsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    bp_systolic?: boolean
    bp_diastolic?: boolean
    bp_systolic2?: boolean
    bp_diastolic2?: boolean
    bp_systolic3?: boolean
    bp_diastolic3?: boolean
    heart_rate?: boolean
    temperature?: boolean
    respiratory_rate?: boolean
    o2_saturation?: boolean
    weight_kg?: boolean
    height_cm?: boolean
    bmi?: boolean
    vision_right_od?: boolean
    vision_left_os?: boolean
    vision_corrected?: boolean
    color_vision?: boolean
    chief_complaint?: boolean
    pcp_doctor?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["vitals"]>

  export type VitalsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    bp_systolic?: boolean
    bp_diastolic?: boolean
    bp_systolic2?: boolean
    bp_diastolic2?: boolean
    bp_systolic3?: boolean
    bp_diastolic3?: boolean
    heart_rate?: boolean
    temperature?: boolean
    respiratory_rate?: boolean
    o2_saturation?: boolean
    weight_kg?: boolean
    height_cm?: boolean
    bmi?: boolean
    vision_right_od?: boolean
    vision_left_os?: boolean
    vision_corrected?: boolean
    color_vision?: boolean
    chief_complaint?: boolean
    pcp_doctor?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["vitals"]>

  export type VitalsSelectScalar = {
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    bp_systolic?: boolean
    bp_diastolic?: boolean
    bp_systolic2?: boolean
    bp_diastolic2?: boolean
    bp_systolic3?: boolean
    bp_diastolic3?: boolean
    heart_rate?: boolean
    temperature?: boolean
    respiratory_rate?: boolean
    o2_saturation?: boolean
    weight_kg?: boolean
    height_cm?: boolean
    bmi?: boolean
    vision_right_od?: boolean
    vision_left_os?: boolean
    vision_corrected?: boolean
    color_vision?: boolean
    chief_complaint?: boolean
    pcp_doctor?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type VitalsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "queue_id" | "patient_id" | "bp_systolic" | "bp_diastolic" | "bp_systolic2" | "bp_diastolic2" | "bp_systolic3" | "bp_diastolic3" | "heart_rate" | "temperature" | "respiratory_rate" | "o2_saturation" | "weight_kg" | "height_cm" | "bmi" | "vision_right_od" | "vision_left_os" | "vision_corrected" | "color_vision" | "chief_complaint" | "pcp_doctor" | "recorded_by" | "created_at" | "updated_at", ExtArgs["result"]["vitals"]>

  export type $VitalsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vitals"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      queue_id: number
      patient_id: string | null
      bp_systolic: number | null
      bp_diastolic: number | null
      bp_systolic2: number | null
      bp_diastolic2: number | null
      bp_systolic3: number | null
      bp_diastolic3: number | null
      heart_rate: number | null
      temperature: number | null
      respiratory_rate: number | null
      o2_saturation: number | null
      weight_kg: number | null
      height_cm: number | null
      bmi: number | null
      vision_right_od: string | null
      vision_left_os: string | null
      vision_corrected: string | null
      color_vision: string | null
      chief_complaint: string | null
      pcp_doctor: string | null
      recorded_by: number | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["vitals"]>
    composites: {}
  }

  type VitalsGetPayload<S extends boolean | null | undefined | VitalsDefaultArgs> = $Result.GetResult<Prisma.$VitalsPayload, S>

  type VitalsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VitalsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VitalsCountAggregateInputType | true
    }

  export interface VitalsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vitals'], meta: { name: 'Vitals' } }
    /**
     * Find zero or one Vitals that matches the filter.
     * @param {VitalsFindUniqueArgs} args - Arguments to find a Vitals
     * @example
     * // Get one Vitals
     * const vitals = await prisma.vitals.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VitalsFindUniqueArgs>(args: SelectSubset<T, VitalsFindUniqueArgs<ExtArgs>>): Prisma__VitalsClient<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vitals that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VitalsFindUniqueOrThrowArgs} args - Arguments to find a Vitals
     * @example
     * // Get one Vitals
     * const vitals = await prisma.vitals.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VitalsFindUniqueOrThrowArgs>(args: SelectSubset<T, VitalsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VitalsClient<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vitals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalsFindFirstArgs} args - Arguments to find a Vitals
     * @example
     * // Get one Vitals
     * const vitals = await prisma.vitals.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VitalsFindFirstArgs>(args?: SelectSubset<T, VitalsFindFirstArgs<ExtArgs>>): Prisma__VitalsClient<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vitals that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalsFindFirstOrThrowArgs} args - Arguments to find a Vitals
     * @example
     * // Get one Vitals
     * const vitals = await prisma.vitals.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VitalsFindFirstOrThrowArgs>(args?: SelectSubset<T, VitalsFindFirstOrThrowArgs<ExtArgs>>): Prisma__VitalsClient<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vitals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vitals
     * const vitals = await prisma.vitals.findMany()
     * 
     * // Get first 10 Vitals
     * const vitals = await prisma.vitals.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vitalsWithIdOnly = await prisma.vitals.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VitalsFindManyArgs>(args?: SelectSubset<T, VitalsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vitals.
     * @param {VitalsCreateArgs} args - Arguments to create a Vitals.
     * @example
     * // Create one Vitals
     * const Vitals = await prisma.vitals.create({
     *   data: {
     *     // ... data to create a Vitals
     *   }
     * })
     * 
     */
    create<T extends VitalsCreateArgs>(args: SelectSubset<T, VitalsCreateArgs<ExtArgs>>): Prisma__VitalsClient<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vitals.
     * @param {VitalsCreateManyArgs} args - Arguments to create many Vitals.
     * @example
     * // Create many Vitals
     * const vitals = await prisma.vitals.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VitalsCreateManyArgs>(args?: SelectSubset<T, VitalsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vitals and returns the data saved in the database.
     * @param {VitalsCreateManyAndReturnArgs} args - Arguments to create many Vitals.
     * @example
     * // Create many Vitals
     * const vitals = await prisma.vitals.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vitals and only return the `id`
     * const vitalsWithIdOnly = await prisma.vitals.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VitalsCreateManyAndReturnArgs>(args?: SelectSubset<T, VitalsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vitals.
     * @param {VitalsDeleteArgs} args - Arguments to delete one Vitals.
     * @example
     * // Delete one Vitals
     * const Vitals = await prisma.vitals.delete({
     *   where: {
     *     // ... filter to delete one Vitals
     *   }
     * })
     * 
     */
    delete<T extends VitalsDeleteArgs>(args: SelectSubset<T, VitalsDeleteArgs<ExtArgs>>): Prisma__VitalsClient<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vitals.
     * @param {VitalsUpdateArgs} args - Arguments to update one Vitals.
     * @example
     * // Update one Vitals
     * const vitals = await prisma.vitals.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VitalsUpdateArgs>(args: SelectSubset<T, VitalsUpdateArgs<ExtArgs>>): Prisma__VitalsClient<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vitals.
     * @param {VitalsDeleteManyArgs} args - Arguments to filter Vitals to delete.
     * @example
     * // Delete a few Vitals
     * const { count } = await prisma.vitals.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VitalsDeleteManyArgs>(args?: SelectSubset<T, VitalsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vitals
     * const vitals = await prisma.vitals.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VitalsUpdateManyArgs>(args: SelectSubset<T, VitalsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vitals and returns the data updated in the database.
     * @param {VitalsUpdateManyAndReturnArgs} args - Arguments to update many Vitals.
     * @example
     * // Update many Vitals
     * const vitals = await prisma.vitals.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vitals and only return the `id`
     * const vitalsWithIdOnly = await prisma.vitals.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VitalsUpdateManyAndReturnArgs>(args: SelectSubset<T, VitalsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vitals.
     * @param {VitalsUpsertArgs} args - Arguments to update or create a Vitals.
     * @example
     * // Update or create a Vitals
     * const vitals = await prisma.vitals.upsert({
     *   create: {
     *     // ... data to create a Vitals
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vitals we want to update
     *   }
     * })
     */
    upsert<T extends VitalsUpsertArgs>(args: SelectSubset<T, VitalsUpsertArgs<ExtArgs>>): Prisma__VitalsClient<$Result.GetResult<Prisma.$VitalsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalsCountArgs} args - Arguments to filter Vitals to count.
     * @example
     * // Count the number of Vitals
     * const count = await prisma.vitals.count({
     *   where: {
     *     // ... the filter for the Vitals we want to count
     *   }
     * })
    **/
    count<T extends VitalsCountArgs>(
      args?: Subset<T, VitalsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VitalsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VitalsAggregateArgs>(args: Subset<T, VitalsAggregateArgs>): Prisma.PrismaPromise<GetVitalsAggregateType<T>>

    /**
     * Group by Vitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VitalsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VitalsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VitalsGroupByArgs['orderBy'] }
        : { orderBy?: VitalsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VitalsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVitalsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vitals model
   */
  readonly fields: VitalsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vitals.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VitalsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vitals model
   */
  interface VitalsFieldRefs {
    readonly id: FieldRef<"Vitals", 'Int'>
    readonly queue_id: FieldRef<"Vitals", 'Int'>
    readonly patient_id: FieldRef<"Vitals", 'String'>
    readonly bp_systolic: FieldRef<"Vitals", 'Int'>
    readonly bp_diastolic: FieldRef<"Vitals", 'Int'>
    readonly bp_systolic2: FieldRef<"Vitals", 'Int'>
    readonly bp_diastolic2: FieldRef<"Vitals", 'Int'>
    readonly bp_systolic3: FieldRef<"Vitals", 'Int'>
    readonly bp_diastolic3: FieldRef<"Vitals", 'Int'>
    readonly heart_rate: FieldRef<"Vitals", 'Int'>
    readonly temperature: FieldRef<"Vitals", 'Float'>
    readonly respiratory_rate: FieldRef<"Vitals", 'Int'>
    readonly o2_saturation: FieldRef<"Vitals", 'Float'>
    readonly weight_kg: FieldRef<"Vitals", 'Float'>
    readonly height_cm: FieldRef<"Vitals", 'Float'>
    readonly bmi: FieldRef<"Vitals", 'Float'>
    readonly vision_right_od: FieldRef<"Vitals", 'String'>
    readonly vision_left_os: FieldRef<"Vitals", 'String'>
    readonly vision_corrected: FieldRef<"Vitals", 'String'>
    readonly color_vision: FieldRef<"Vitals", 'String'>
    readonly chief_complaint: FieldRef<"Vitals", 'String'>
    readonly pcp_doctor: FieldRef<"Vitals", 'String'>
    readonly recorded_by: FieldRef<"Vitals", 'Int'>
    readonly created_at: FieldRef<"Vitals", 'DateTime'>
    readonly updated_at: FieldRef<"Vitals", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Vitals findUnique
   */
  export type VitalsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * Filter, which Vitals to fetch.
     */
    where: VitalsWhereUniqueInput
  }

  /**
   * Vitals findUniqueOrThrow
   */
  export type VitalsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * Filter, which Vitals to fetch.
     */
    where: VitalsWhereUniqueInput
  }

  /**
   * Vitals findFirst
   */
  export type VitalsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * Filter, which Vitals to fetch.
     */
    where?: VitalsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vitals to fetch.
     */
    orderBy?: VitalsOrderByWithRelationInput | VitalsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vitals.
     */
    cursor?: VitalsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vitals.
     */
    distinct?: VitalsScalarFieldEnum | VitalsScalarFieldEnum[]
  }

  /**
   * Vitals findFirstOrThrow
   */
  export type VitalsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * Filter, which Vitals to fetch.
     */
    where?: VitalsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vitals to fetch.
     */
    orderBy?: VitalsOrderByWithRelationInput | VitalsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vitals.
     */
    cursor?: VitalsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vitals.
     */
    distinct?: VitalsScalarFieldEnum | VitalsScalarFieldEnum[]
  }

  /**
   * Vitals findMany
   */
  export type VitalsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * Filter, which Vitals to fetch.
     */
    where?: VitalsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vitals to fetch.
     */
    orderBy?: VitalsOrderByWithRelationInput | VitalsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vitals.
     */
    cursor?: VitalsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vitals.
     */
    skip?: number
    distinct?: VitalsScalarFieldEnum | VitalsScalarFieldEnum[]
  }

  /**
   * Vitals create
   */
  export type VitalsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * The data needed to create a Vitals.
     */
    data: XOR<VitalsCreateInput, VitalsUncheckedCreateInput>
  }

  /**
   * Vitals createMany
   */
  export type VitalsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vitals.
     */
    data: VitalsCreateManyInput | VitalsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vitals createManyAndReturn
   */
  export type VitalsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * The data used to create many Vitals.
     */
    data: VitalsCreateManyInput | VitalsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Vitals update
   */
  export type VitalsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * The data needed to update a Vitals.
     */
    data: XOR<VitalsUpdateInput, VitalsUncheckedUpdateInput>
    /**
     * Choose, which Vitals to update.
     */
    where: VitalsWhereUniqueInput
  }

  /**
   * Vitals updateMany
   */
  export type VitalsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vitals.
     */
    data: XOR<VitalsUpdateManyMutationInput, VitalsUncheckedUpdateManyInput>
    /**
     * Filter which Vitals to update
     */
    where?: VitalsWhereInput
    /**
     * Limit how many Vitals to update.
     */
    limit?: number
  }

  /**
   * Vitals updateManyAndReturn
   */
  export type VitalsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * The data used to update Vitals.
     */
    data: XOR<VitalsUpdateManyMutationInput, VitalsUncheckedUpdateManyInput>
    /**
     * Filter which Vitals to update
     */
    where?: VitalsWhereInput
    /**
     * Limit how many Vitals to update.
     */
    limit?: number
  }

  /**
   * Vitals upsert
   */
  export type VitalsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * The filter to search for the Vitals to update in case it exists.
     */
    where: VitalsWhereUniqueInput
    /**
     * In case the Vitals found by the `where` argument doesn't exist, create a new Vitals with this data.
     */
    create: XOR<VitalsCreateInput, VitalsUncheckedCreateInput>
    /**
     * In case the Vitals was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VitalsUpdateInput, VitalsUncheckedUpdateInput>
  }

  /**
   * Vitals delete
   */
  export type VitalsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
    /**
     * Filter which Vitals to delete.
     */
    where: VitalsWhereUniqueInput
  }

  /**
   * Vitals deleteMany
   */
  export type VitalsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vitals to delete
     */
    where?: VitalsWhereInput
    /**
     * Limit how many Vitals to delete.
     */
    limit?: number
  }

  /**
   * Vitals without action
   */
  export type VitalsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vitals
     */
    select?: VitalsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vitals
     */
    omit?: VitalsOmit<ExtArgs> | null
  }


  /**
   * Model PhysicalExamination
   */

  export type AggregatePhysicalExamination = {
    _count: PhysicalExaminationCountAggregateOutputType | null
    _avg: PhysicalExaminationAvgAggregateOutputType | null
    _sum: PhysicalExaminationSumAggregateOutputType | null
    _min: PhysicalExaminationMinAggregateOutputType | null
    _max: PhysicalExaminationMaxAggregateOutputType | null
  }

  export type PhysicalExaminationAvgAggregateOutputType = {
    id: number | null
    queue_id: number | null
    pack_years: number | null
    gravida: number | null
    para: number | null
    recorded_by: number | null
  }

  export type PhysicalExaminationSumAggregateOutputType = {
    id: number | null
    queue_id: number | null
    pack_years: number | null
    gravida: number | null
    para: number | null
    recorded_by: number | null
  }

  export type PhysicalExaminationMinAggregateOutputType = {
    id: number | null
    queue_id: number | null
    patient_id: string | null
    hypertension: boolean | null
    diabetes: boolean | null
    asthma: boolean | null
    heart_disease: boolean | null
    thyroid_disease: boolean | null
    kidney_disease: boolean | null
    allergies: boolean | null
    allergies_specify: string | null
    surgery_history: boolean | null
    surgery_specify: string | null
    smoker: boolean | null
    pack_years: number | null
    alcoholic: boolean | null
    lmp: Date | null
    gravida: number | null
    para: number | null
    family_hypertension: boolean | null
    family_diabetes: boolean | null
    family_cancer: boolean | null
    skin: string | null
    heent: string | null
    neck: string | null
    chest_lungs: string | null
    heart: string | null
    abdomen: string | null
    extremities: string | null
    neurological: string | null
    fitness_class: string | null
    recorded_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PhysicalExaminationMaxAggregateOutputType = {
    id: number | null
    queue_id: number | null
    patient_id: string | null
    hypertension: boolean | null
    diabetes: boolean | null
    asthma: boolean | null
    heart_disease: boolean | null
    thyroid_disease: boolean | null
    kidney_disease: boolean | null
    allergies: boolean | null
    allergies_specify: string | null
    surgery_history: boolean | null
    surgery_specify: string | null
    smoker: boolean | null
    pack_years: number | null
    alcoholic: boolean | null
    lmp: Date | null
    gravida: number | null
    para: number | null
    family_hypertension: boolean | null
    family_diabetes: boolean | null
    family_cancer: boolean | null
    skin: string | null
    heent: string | null
    neck: string | null
    chest_lungs: string | null
    heart: string | null
    abdomen: string | null
    extremities: string | null
    neurological: string | null
    fitness_class: string | null
    recorded_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PhysicalExaminationCountAggregateOutputType = {
    id: number
    queue_id: number
    patient_id: number
    hypertension: number
    diabetes: number
    asthma: number
    heart_disease: number
    thyroid_disease: number
    kidney_disease: number
    allergies: number
    allergies_specify: number
    surgery_history: number
    surgery_specify: number
    smoker: number
    pack_years: number
    alcoholic: number
    lmp: number
    gravida: number
    para: number
    family_hypertension: number
    family_diabetes: number
    family_cancer: number
    skin: number
    heent: number
    neck: number
    chest_lungs: number
    heart: number
    abdomen: number
    extremities: number
    neurological: number
    fitness_class: number
    recorded_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type PhysicalExaminationAvgAggregateInputType = {
    id?: true
    queue_id?: true
    pack_years?: true
    gravida?: true
    para?: true
    recorded_by?: true
  }

  export type PhysicalExaminationSumAggregateInputType = {
    id?: true
    queue_id?: true
    pack_years?: true
    gravida?: true
    para?: true
    recorded_by?: true
  }

  export type PhysicalExaminationMinAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    hypertension?: true
    diabetes?: true
    asthma?: true
    heart_disease?: true
    thyroid_disease?: true
    kidney_disease?: true
    allergies?: true
    allergies_specify?: true
    surgery_history?: true
    surgery_specify?: true
    smoker?: true
    pack_years?: true
    alcoholic?: true
    lmp?: true
    gravida?: true
    para?: true
    family_hypertension?: true
    family_diabetes?: true
    family_cancer?: true
    skin?: true
    heent?: true
    neck?: true
    chest_lungs?: true
    heart?: true
    abdomen?: true
    extremities?: true
    neurological?: true
    fitness_class?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
  }

  export type PhysicalExaminationMaxAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    hypertension?: true
    diabetes?: true
    asthma?: true
    heart_disease?: true
    thyroid_disease?: true
    kidney_disease?: true
    allergies?: true
    allergies_specify?: true
    surgery_history?: true
    surgery_specify?: true
    smoker?: true
    pack_years?: true
    alcoholic?: true
    lmp?: true
    gravida?: true
    para?: true
    family_hypertension?: true
    family_diabetes?: true
    family_cancer?: true
    skin?: true
    heent?: true
    neck?: true
    chest_lungs?: true
    heart?: true
    abdomen?: true
    extremities?: true
    neurological?: true
    fitness_class?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
  }

  export type PhysicalExaminationCountAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    hypertension?: true
    diabetes?: true
    asthma?: true
    heart_disease?: true
    thyroid_disease?: true
    kidney_disease?: true
    allergies?: true
    allergies_specify?: true
    surgery_history?: true
    surgery_specify?: true
    smoker?: true
    pack_years?: true
    alcoholic?: true
    lmp?: true
    gravida?: true
    para?: true
    family_hypertension?: true
    family_diabetes?: true
    family_cancer?: true
    skin?: true
    heent?: true
    neck?: true
    chest_lungs?: true
    heart?: true
    abdomen?: true
    extremities?: true
    neurological?: true
    fitness_class?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type PhysicalExaminationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PhysicalExamination to aggregate.
     */
    where?: PhysicalExaminationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhysicalExaminations to fetch.
     */
    orderBy?: PhysicalExaminationOrderByWithRelationInput | PhysicalExaminationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhysicalExaminationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhysicalExaminations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhysicalExaminations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PhysicalExaminations
    **/
    _count?: true | PhysicalExaminationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhysicalExaminationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhysicalExaminationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhysicalExaminationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhysicalExaminationMaxAggregateInputType
  }

  export type GetPhysicalExaminationAggregateType<T extends PhysicalExaminationAggregateArgs> = {
        [P in keyof T & keyof AggregatePhysicalExamination]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhysicalExamination[P]>
      : GetScalarType<T[P], AggregatePhysicalExamination[P]>
  }




  export type PhysicalExaminationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhysicalExaminationWhereInput
    orderBy?: PhysicalExaminationOrderByWithAggregationInput | PhysicalExaminationOrderByWithAggregationInput[]
    by: PhysicalExaminationScalarFieldEnum[] | PhysicalExaminationScalarFieldEnum
    having?: PhysicalExaminationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhysicalExaminationCountAggregateInputType | true
    _avg?: PhysicalExaminationAvgAggregateInputType
    _sum?: PhysicalExaminationSumAggregateInputType
    _min?: PhysicalExaminationMinAggregateInputType
    _max?: PhysicalExaminationMaxAggregateInputType
  }

  export type PhysicalExaminationGroupByOutputType = {
    id: number
    queue_id: number
    patient_id: string | null
    hypertension: boolean
    diabetes: boolean
    asthma: boolean
    heart_disease: boolean
    thyroid_disease: boolean
    kidney_disease: boolean
    allergies: boolean
    allergies_specify: string | null
    surgery_history: boolean
    surgery_specify: string | null
    smoker: boolean
    pack_years: number | null
    alcoholic: boolean
    lmp: Date | null
    gravida: number | null
    para: number | null
    family_hypertension: boolean
    family_diabetes: boolean
    family_cancer: boolean
    skin: string | null
    heent: string | null
    neck: string | null
    chest_lungs: string | null
    heart: string | null
    abdomen: string | null
    extremities: string | null
    neurological: string | null
    fitness_class: string | null
    recorded_by: number | null
    created_at: Date
    updated_at: Date
    _count: PhysicalExaminationCountAggregateOutputType | null
    _avg: PhysicalExaminationAvgAggregateOutputType | null
    _sum: PhysicalExaminationSumAggregateOutputType | null
    _min: PhysicalExaminationMinAggregateOutputType | null
    _max: PhysicalExaminationMaxAggregateOutputType | null
  }

  type GetPhysicalExaminationGroupByPayload<T extends PhysicalExaminationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhysicalExaminationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhysicalExaminationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhysicalExaminationGroupByOutputType[P]>
            : GetScalarType<T[P], PhysicalExaminationGroupByOutputType[P]>
        }
      >
    >


  export type PhysicalExaminationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    hypertension?: boolean
    diabetes?: boolean
    asthma?: boolean
    heart_disease?: boolean
    thyroid_disease?: boolean
    kidney_disease?: boolean
    allergies?: boolean
    allergies_specify?: boolean
    surgery_history?: boolean
    surgery_specify?: boolean
    smoker?: boolean
    pack_years?: boolean
    alcoholic?: boolean
    lmp?: boolean
    gravida?: boolean
    para?: boolean
    family_hypertension?: boolean
    family_diabetes?: boolean
    family_cancer?: boolean
    skin?: boolean
    heent?: boolean
    neck?: boolean
    chest_lungs?: boolean
    heart?: boolean
    abdomen?: boolean
    extremities?: boolean
    neurological?: boolean
    fitness_class?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["physicalExamination"]>

  export type PhysicalExaminationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    hypertension?: boolean
    diabetes?: boolean
    asthma?: boolean
    heart_disease?: boolean
    thyroid_disease?: boolean
    kidney_disease?: boolean
    allergies?: boolean
    allergies_specify?: boolean
    surgery_history?: boolean
    surgery_specify?: boolean
    smoker?: boolean
    pack_years?: boolean
    alcoholic?: boolean
    lmp?: boolean
    gravida?: boolean
    para?: boolean
    family_hypertension?: boolean
    family_diabetes?: boolean
    family_cancer?: boolean
    skin?: boolean
    heent?: boolean
    neck?: boolean
    chest_lungs?: boolean
    heart?: boolean
    abdomen?: boolean
    extremities?: boolean
    neurological?: boolean
    fitness_class?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["physicalExamination"]>

  export type PhysicalExaminationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    hypertension?: boolean
    diabetes?: boolean
    asthma?: boolean
    heart_disease?: boolean
    thyroid_disease?: boolean
    kidney_disease?: boolean
    allergies?: boolean
    allergies_specify?: boolean
    surgery_history?: boolean
    surgery_specify?: boolean
    smoker?: boolean
    pack_years?: boolean
    alcoholic?: boolean
    lmp?: boolean
    gravida?: boolean
    para?: boolean
    family_hypertension?: boolean
    family_diabetes?: boolean
    family_cancer?: boolean
    skin?: boolean
    heent?: boolean
    neck?: boolean
    chest_lungs?: boolean
    heart?: boolean
    abdomen?: boolean
    extremities?: boolean
    neurological?: boolean
    fitness_class?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["physicalExamination"]>

  export type PhysicalExaminationSelectScalar = {
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    hypertension?: boolean
    diabetes?: boolean
    asthma?: boolean
    heart_disease?: boolean
    thyroid_disease?: boolean
    kidney_disease?: boolean
    allergies?: boolean
    allergies_specify?: boolean
    surgery_history?: boolean
    surgery_specify?: boolean
    smoker?: boolean
    pack_years?: boolean
    alcoholic?: boolean
    lmp?: boolean
    gravida?: boolean
    para?: boolean
    family_hypertension?: boolean
    family_diabetes?: boolean
    family_cancer?: boolean
    skin?: boolean
    heent?: boolean
    neck?: boolean
    chest_lungs?: boolean
    heart?: boolean
    abdomen?: boolean
    extremities?: boolean
    neurological?: boolean
    fitness_class?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type PhysicalExaminationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "queue_id" | "patient_id" | "hypertension" | "diabetes" | "asthma" | "heart_disease" | "thyroid_disease" | "kidney_disease" | "allergies" | "allergies_specify" | "surgery_history" | "surgery_specify" | "smoker" | "pack_years" | "alcoholic" | "lmp" | "gravida" | "para" | "family_hypertension" | "family_diabetes" | "family_cancer" | "skin" | "heent" | "neck" | "chest_lungs" | "heart" | "abdomen" | "extremities" | "neurological" | "fitness_class" | "recorded_by" | "created_at" | "updated_at", ExtArgs["result"]["physicalExamination"]>

  export type $PhysicalExaminationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PhysicalExamination"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      queue_id: number
      patient_id: string | null
      hypertension: boolean
      diabetes: boolean
      asthma: boolean
      heart_disease: boolean
      thyroid_disease: boolean
      kidney_disease: boolean
      allergies: boolean
      allergies_specify: string | null
      surgery_history: boolean
      surgery_specify: string | null
      smoker: boolean
      pack_years: number | null
      alcoholic: boolean
      lmp: Date | null
      gravida: number | null
      para: number | null
      family_hypertension: boolean
      family_diabetes: boolean
      family_cancer: boolean
      skin: string | null
      heent: string | null
      neck: string | null
      chest_lungs: string | null
      heart: string | null
      abdomen: string | null
      extremities: string | null
      neurological: string | null
      fitness_class: string | null
      recorded_by: number | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["physicalExamination"]>
    composites: {}
  }

  type PhysicalExaminationGetPayload<S extends boolean | null | undefined | PhysicalExaminationDefaultArgs> = $Result.GetResult<Prisma.$PhysicalExaminationPayload, S>

  type PhysicalExaminationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PhysicalExaminationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PhysicalExaminationCountAggregateInputType | true
    }

  export interface PhysicalExaminationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PhysicalExamination'], meta: { name: 'PhysicalExamination' } }
    /**
     * Find zero or one PhysicalExamination that matches the filter.
     * @param {PhysicalExaminationFindUniqueArgs} args - Arguments to find a PhysicalExamination
     * @example
     * // Get one PhysicalExamination
     * const physicalExamination = await prisma.physicalExamination.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhysicalExaminationFindUniqueArgs>(args: SelectSubset<T, PhysicalExaminationFindUniqueArgs<ExtArgs>>): Prisma__PhysicalExaminationClient<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PhysicalExamination that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PhysicalExaminationFindUniqueOrThrowArgs} args - Arguments to find a PhysicalExamination
     * @example
     * // Get one PhysicalExamination
     * const physicalExamination = await prisma.physicalExamination.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhysicalExaminationFindUniqueOrThrowArgs>(args: SelectSubset<T, PhysicalExaminationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhysicalExaminationClient<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PhysicalExamination that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicalExaminationFindFirstArgs} args - Arguments to find a PhysicalExamination
     * @example
     * // Get one PhysicalExamination
     * const physicalExamination = await prisma.physicalExamination.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhysicalExaminationFindFirstArgs>(args?: SelectSubset<T, PhysicalExaminationFindFirstArgs<ExtArgs>>): Prisma__PhysicalExaminationClient<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PhysicalExamination that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicalExaminationFindFirstOrThrowArgs} args - Arguments to find a PhysicalExamination
     * @example
     * // Get one PhysicalExamination
     * const physicalExamination = await prisma.physicalExamination.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhysicalExaminationFindFirstOrThrowArgs>(args?: SelectSubset<T, PhysicalExaminationFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhysicalExaminationClient<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PhysicalExaminations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicalExaminationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PhysicalExaminations
     * const physicalExaminations = await prisma.physicalExamination.findMany()
     * 
     * // Get first 10 PhysicalExaminations
     * const physicalExaminations = await prisma.physicalExamination.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const physicalExaminationWithIdOnly = await prisma.physicalExamination.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhysicalExaminationFindManyArgs>(args?: SelectSubset<T, PhysicalExaminationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PhysicalExamination.
     * @param {PhysicalExaminationCreateArgs} args - Arguments to create a PhysicalExamination.
     * @example
     * // Create one PhysicalExamination
     * const PhysicalExamination = await prisma.physicalExamination.create({
     *   data: {
     *     // ... data to create a PhysicalExamination
     *   }
     * })
     * 
     */
    create<T extends PhysicalExaminationCreateArgs>(args: SelectSubset<T, PhysicalExaminationCreateArgs<ExtArgs>>): Prisma__PhysicalExaminationClient<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PhysicalExaminations.
     * @param {PhysicalExaminationCreateManyArgs} args - Arguments to create many PhysicalExaminations.
     * @example
     * // Create many PhysicalExaminations
     * const physicalExamination = await prisma.physicalExamination.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhysicalExaminationCreateManyArgs>(args?: SelectSubset<T, PhysicalExaminationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PhysicalExaminations and returns the data saved in the database.
     * @param {PhysicalExaminationCreateManyAndReturnArgs} args - Arguments to create many PhysicalExaminations.
     * @example
     * // Create many PhysicalExaminations
     * const physicalExamination = await prisma.physicalExamination.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PhysicalExaminations and only return the `id`
     * const physicalExaminationWithIdOnly = await prisma.physicalExamination.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PhysicalExaminationCreateManyAndReturnArgs>(args?: SelectSubset<T, PhysicalExaminationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PhysicalExamination.
     * @param {PhysicalExaminationDeleteArgs} args - Arguments to delete one PhysicalExamination.
     * @example
     * // Delete one PhysicalExamination
     * const PhysicalExamination = await prisma.physicalExamination.delete({
     *   where: {
     *     // ... filter to delete one PhysicalExamination
     *   }
     * })
     * 
     */
    delete<T extends PhysicalExaminationDeleteArgs>(args: SelectSubset<T, PhysicalExaminationDeleteArgs<ExtArgs>>): Prisma__PhysicalExaminationClient<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PhysicalExamination.
     * @param {PhysicalExaminationUpdateArgs} args - Arguments to update one PhysicalExamination.
     * @example
     * // Update one PhysicalExamination
     * const physicalExamination = await prisma.physicalExamination.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhysicalExaminationUpdateArgs>(args: SelectSubset<T, PhysicalExaminationUpdateArgs<ExtArgs>>): Prisma__PhysicalExaminationClient<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PhysicalExaminations.
     * @param {PhysicalExaminationDeleteManyArgs} args - Arguments to filter PhysicalExaminations to delete.
     * @example
     * // Delete a few PhysicalExaminations
     * const { count } = await prisma.physicalExamination.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhysicalExaminationDeleteManyArgs>(args?: SelectSubset<T, PhysicalExaminationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PhysicalExaminations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicalExaminationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PhysicalExaminations
     * const physicalExamination = await prisma.physicalExamination.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhysicalExaminationUpdateManyArgs>(args: SelectSubset<T, PhysicalExaminationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PhysicalExaminations and returns the data updated in the database.
     * @param {PhysicalExaminationUpdateManyAndReturnArgs} args - Arguments to update many PhysicalExaminations.
     * @example
     * // Update many PhysicalExaminations
     * const physicalExamination = await prisma.physicalExamination.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PhysicalExaminations and only return the `id`
     * const physicalExaminationWithIdOnly = await prisma.physicalExamination.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PhysicalExaminationUpdateManyAndReturnArgs>(args: SelectSubset<T, PhysicalExaminationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PhysicalExamination.
     * @param {PhysicalExaminationUpsertArgs} args - Arguments to update or create a PhysicalExamination.
     * @example
     * // Update or create a PhysicalExamination
     * const physicalExamination = await prisma.physicalExamination.upsert({
     *   create: {
     *     // ... data to create a PhysicalExamination
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PhysicalExamination we want to update
     *   }
     * })
     */
    upsert<T extends PhysicalExaminationUpsertArgs>(args: SelectSubset<T, PhysicalExaminationUpsertArgs<ExtArgs>>): Prisma__PhysicalExaminationClient<$Result.GetResult<Prisma.$PhysicalExaminationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PhysicalExaminations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicalExaminationCountArgs} args - Arguments to filter PhysicalExaminations to count.
     * @example
     * // Count the number of PhysicalExaminations
     * const count = await prisma.physicalExamination.count({
     *   where: {
     *     // ... the filter for the PhysicalExaminations we want to count
     *   }
     * })
    **/
    count<T extends PhysicalExaminationCountArgs>(
      args?: Subset<T, PhysicalExaminationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhysicalExaminationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PhysicalExamination.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicalExaminationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhysicalExaminationAggregateArgs>(args: Subset<T, PhysicalExaminationAggregateArgs>): Prisma.PrismaPromise<GetPhysicalExaminationAggregateType<T>>

    /**
     * Group by PhysicalExamination.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicalExaminationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhysicalExaminationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhysicalExaminationGroupByArgs['orderBy'] }
        : { orderBy?: PhysicalExaminationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhysicalExaminationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhysicalExaminationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PhysicalExamination model
   */
  readonly fields: PhysicalExaminationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PhysicalExamination.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhysicalExaminationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PhysicalExamination model
   */
  interface PhysicalExaminationFieldRefs {
    readonly id: FieldRef<"PhysicalExamination", 'Int'>
    readonly queue_id: FieldRef<"PhysicalExamination", 'Int'>
    readonly patient_id: FieldRef<"PhysicalExamination", 'String'>
    readonly hypertension: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly diabetes: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly asthma: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly heart_disease: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly thyroid_disease: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly kidney_disease: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly allergies: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly allergies_specify: FieldRef<"PhysicalExamination", 'String'>
    readonly surgery_history: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly surgery_specify: FieldRef<"PhysicalExamination", 'String'>
    readonly smoker: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly pack_years: FieldRef<"PhysicalExamination", 'Float'>
    readonly alcoholic: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly lmp: FieldRef<"PhysicalExamination", 'DateTime'>
    readonly gravida: FieldRef<"PhysicalExamination", 'Int'>
    readonly para: FieldRef<"PhysicalExamination", 'Int'>
    readonly family_hypertension: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly family_diabetes: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly family_cancer: FieldRef<"PhysicalExamination", 'Boolean'>
    readonly skin: FieldRef<"PhysicalExamination", 'String'>
    readonly heent: FieldRef<"PhysicalExamination", 'String'>
    readonly neck: FieldRef<"PhysicalExamination", 'String'>
    readonly chest_lungs: FieldRef<"PhysicalExamination", 'String'>
    readonly heart: FieldRef<"PhysicalExamination", 'String'>
    readonly abdomen: FieldRef<"PhysicalExamination", 'String'>
    readonly extremities: FieldRef<"PhysicalExamination", 'String'>
    readonly neurological: FieldRef<"PhysicalExamination", 'String'>
    readonly fitness_class: FieldRef<"PhysicalExamination", 'String'>
    readonly recorded_by: FieldRef<"PhysicalExamination", 'Int'>
    readonly created_at: FieldRef<"PhysicalExamination", 'DateTime'>
    readonly updated_at: FieldRef<"PhysicalExamination", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PhysicalExamination findUnique
   */
  export type PhysicalExaminationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * Filter, which PhysicalExamination to fetch.
     */
    where: PhysicalExaminationWhereUniqueInput
  }

  /**
   * PhysicalExamination findUniqueOrThrow
   */
  export type PhysicalExaminationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * Filter, which PhysicalExamination to fetch.
     */
    where: PhysicalExaminationWhereUniqueInput
  }

  /**
   * PhysicalExamination findFirst
   */
  export type PhysicalExaminationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * Filter, which PhysicalExamination to fetch.
     */
    where?: PhysicalExaminationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhysicalExaminations to fetch.
     */
    orderBy?: PhysicalExaminationOrderByWithRelationInput | PhysicalExaminationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PhysicalExaminations.
     */
    cursor?: PhysicalExaminationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhysicalExaminations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhysicalExaminations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PhysicalExaminations.
     */
    distinct?: PhysicalExaminationScalarFieldEnum | PhysicalExaminationScalarFieldEnum[]
  }

  /**
   * PhysicalExamination findFirstOrThrow
   */
  export type PhysicalExaminationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * Filter, which PhysicalExamination to fetch.
     */
    where?: PhysicalExaminationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhysicalExaminations to fetch.
     */
    orderBy?: PhysicalExaminationOrderByWithRelationInput | PhysicalExaminationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PhysicalExaminations.
     */
    cursor?: PhysicalExaminationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhysicalExaminations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhysicalExaminations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PhysicalExaminations.
     */
    distinct?: PhysicalExaminationScalarFieldEnum | PhysicalExaminationScalarFieldEnum[]
  }

  /**
   * PhysicalExamination findMany
   */
  export type PhysicalExaminationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * Filter, which PhysicalExaminations to fetch.
     */
    where?: PhysicalExaminationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhysicalExaminations to fetch.
     */
    orderBy?: PhysicalExaminationOrderByWithRelationInput | PhysicalExaminationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PhysicalExaminations.
     */
    cursor?: PhysicalExaminationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhysicalExaminations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhysicalExaminations.
     */
    skip?: number
    distinct?: PhysicalExaminationScalarFieldEnum | PhysicalExaminationScalarFieldEnum[]
  }

  /**
   * PhysicalExamination create
   */
  export type PhysicalExaminationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * The data needed to create a PhysicalExamination.
     */
    data: XOR<PhysicalExaminationCreateInput, PhysicalExaminationUncheckedCreateInput>
  }

  /**
   * PhysicalExamination createMany
   */
  export type PhysicalExaminationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PhysicalExaminations.
     */
    data: PhysicalExaminationCreateManyInput | PhysicalExaminationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PhysicalExamination createManyAndReturn
   */
  export type PhysicalExaminationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * The data used to create many PhysicalExaminations.
     */
    data: PhysicalExaminationCreateManyInput | PhysicalExaminationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PhysicalExamination update
   */
  export type PhysicalExaminationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * The data needed to update a PhysicalExamination.
     */
    data: XOR<PhysicalExaminationUpdateInput, PhysicalExaminationUncheckedUpdateInput>
    /**
     * Choose, which PhysicalExamination to update.
     */
    where: PhysicalExaminationWhereUniqueInput
  }

  /**
   * PhysicalExamination updateMany
   */
  export type PhysicalExaminationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PhysicalExaminations.
     */
    data: XOR<PhysicalExaminationUpdateManyMutationInput, PhysicalExaminationUncheckedUpdateManyInput>
    /**
     * Filter which PhysicalExaminations to update
     */
    where?: PhysicalExaminationWhereInput
    /**
     * Limit how many PhysicalExaminations to update.
     */
    limit?: number
  }

  /**
   * PhysicalExamination updateManyAndReturn
   */
  export type PhysicalExaminationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * The data used to update PhysicalExaminations.
     */
    data: XOR<PhysicalExaminationUpdateManyMutationInput, PhysicalExaminationUncheckedUpdateManyInput>
    /**
     * Filter which PhysicalExaminations to update
     */
    where?: PhysicalExaminationWhereInput
    /**
     * Limit how many PhysicalExaminations to update.
     */
    limit?: number
  }

  /**
   * PhysicalExamination upsert
   */
  export type PhysicalExaminationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * The filter to search for the PhysicalExamination to update in case it exists.
     */
    where: PhysicalExaminationWhereUniqueInput
    /**
     * In case the PhysicalExamination found by the `where` argument doesn't exist, create a new PhysicalExamination with this data.
     */
    create: XOR<PhysicalExaminationCreateInput, PhysicalExaminationUncheckedCreateInput>
    /**
     * In case the PhysicalExamination was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhysicalExaminationUpdateInput, PhysicalExaminationUncheckedUpdateInput>
  }

  /**
   * PhysicalExamination delete
   */
  export type PhysicalExaminationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
    /**
     * Filter which PhysicalExamination to delete.
     */
    where: PhysicalExaminationWhereUniqueInput
  }

  /**
   * PhysicalExamination deleteMany
   */
  export type PhysicalExaminationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PhysicalExaminations to delete
     */
    where?: PhysicalExaminationWhereInput
    /**
     * Limit how many PhysicalExaminations to delete.
     */
    limit?: number
  }

  /**
   * PhysicalExamination without action
   */
  export type PhysicalExaminationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhysicalExamination
     */
    select?: PhysicalExaminationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhysicalExamination
     */
    omit?: PhysicalExaminationOmit<ExtArgs> | null
  }


  /**
   * Model MedicalEvaluation
   */

  export type AggregateMedicalEvaluation = {
    _count: MedicalEvaluationCountAggregateOutputType | null
    _avg: MedicalEvaluationAvgAggregateOutputType | null
    _sum: MedicalEvaluationSumAggregateOutputType | null
    _min: MedicalEvaluationMinAggregateOutputType | null
    _max: MedicalEvaluationMaxAggregateOutputType | null
  }

  export type MedicalEvaluationAvgAggregateOutputType = {
    id: number | null
    queue_id: number | null
    recorded_by: number | null
  }

  export type MedicalEvaluationSumAggregateOutputType = {
    id: number | null
    queue_id: number | null
    recorded_by: number | null
  }

  export type MedicalEvaluationMinAggregateOutputType = {
    id: number | null
    queue_id: number | null
    patient_id: string | null
    item_code: string | null
    item_name: string | null
    findings: string | null
    assessment: string | null
    recommendation: string | null
    class_value: string | null
    recorded_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MedicalEvaluationMaxAggregateOutputType = {
    id: number | null
    queue_id: number | null
    patient_id: string | null
    item_code: string | null
    item_name: string | null
    findings: string | null
    assessment: string | null
    recommendation: string | null
    class_value: string | null
    recorded_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type MedicalEvaluationCountAggregateOutputType = {
    id: number
    queue_id: number
    patient_id: number
    item_code: number
    item_name: number
    findings: number
    assessment: number
    recommendation: number
    class_value: number
    recorded_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type MedicalEvaluationAvgAggregateInputType = {
    id?: true
    queue_id?: true
    recorded_by?: true
  }

  export type MedicalEvaluationSumAggregateInputType = {
    id?: true
    queue_id?: true
    recorded_by?: true
  }

  export type MedicalEvaluationMinAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    item_code?: true
    item_name?: true
    findings?: true
    assessment?: true
    recommendation?: true
    class_value?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
  }

  export type MedicalEvaluationMaxAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    item_code?: true
    item_name?: true
    findings?: true
    assessment?: true
    recommendation?: true
    class_value?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
  }

  export type MedicalEvaluationCountAggregateInputType = {
    id?: true
    queue_id?: true
    patient_id?: true
    item_code?: true
    item_name?: true
    findings?: true
    assessment?: true
    recommendation?: true
    class_value?: true
    recorded_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type MedicalEvaluationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MedicalEvaluation to aggregate.
     */
    where?: MedicalEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MedicalEvaluations to fetch.
     */
    orderBy?: MedicalEvaluationOrderByWithRelationInput | MedicalEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MedicalEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MedicalEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MedicalEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MedicalEvaluations
    **/
    _count?: true | MedicalEvaluationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MedicalEvaluationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MedicalEvaluationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MedicalEvaluationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MedicalEvaluationMaxAggregateInputType
  }

  export type GetMedicalEvaluationAggregateType<T extends MedicalEvaluationAggregateArgs> = {
        [P in keyof T & keyof AggregateMedicalEvaluation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMedicalEvaluation[P]>
      : GetScalarType<T[P], AggregateMedicalEvaluation[P]>
  }




  export type MedicalEvaluationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MedicalEvaluationWhereInput
    orderBy?: MedicalEvaluationOrderByWithAggregationInput | MedicalEvaluationOrderByWithAggregationInput[]
    by: MedicalEvaluationScalarFieldEnum[] | MedicalEvaluationScalarFieldEnum
    having?: MedicalEvaluationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MedicalEvaluationCountAggregateInputType | true
    _avg?: MedicalEvaluationAvgAggregateInputType
    _sum?: MedicalEvaluationSumAggregateInputType
    _min?: MedicalEvaluationMinAggregateInputType
    _max?: MedicalEvaluationMaxAggregateInputType
  }

  export type MedicalEvaluationGroupByOutputType = {
    id: number
    queue_id: number
    patient_id: string
    item_code: string
    item_name: string | null
    findings: string | null
    assessment: string | null
    recommendation: string | null
    class_value: string | null
    recorded_by: number | null
    created_at: Date
    updated_at: Date
    _count: MedicalEvaluationCountAggregateOutputType | null
    _avg: MedicalEvaluationAvgAggregateOutputType | null
    _sum: MedicalEvaluationSumAggregateOutputType | null
    _min: MedicalEvaluationMinAggregateOutputType | null
    _max: MedicalEvaluationMaxAggregateOutputType | null
  }

  type GetMedicalEvaluationGroupByPayload<T extends MedicalEvaluationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MedicalEvaluationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MedicalEvaluationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MedicalEvaluationGroupByOutputType[P]>
            : GetScalarType<T[P], MedicalEvaluationGroupByOutputType[P]>
        }
      >
    >


  export type MedicalEvaluationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    item_code?: boolean
    item_name?: boolean
    findings?: boolean
    assessment?: boolean
    recommendation?: boolean
    class_value?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["medicalEvaluation"]>

  export type MedicalEvaluationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    item_code?: boolean
    item_name?: boolean
    findings?: boolean
    assessment?: boolean
    recommendation?: boolean
    class_value?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["medicalEvaluation"]>

  export type MedicalEvaluationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    item_code?: boolean
    item_name?: boolean
    findings?: boolean
    assessment?: boolean
    recommendation?: boolean
    class_value?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["medicalEvaluation"]>

  export type MedicalEvaluationSelectScalar = {
    id?: boolean
    queue_id?: boolean
    patient_id?: boolean
    item_code?: boolean
    item_name?: boolean
    findings?: boolean
    assessment?: boolean
    recommendation?: boolean
    class_value?: boolean
    recorded_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type MedicalEvaluationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "queue_id" | "patient_id" | "item_code" | "item_name" | "findings" | "assessment" | "recommendation" | "class_value" | "recorded_by" | "created_at" | "updated_at", ExtArgs["result"]["medicalEvaluation"]>

  export type $MedicalEvaluationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MedicalEvaluation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      queue_id: number
      patient_id: string
      item_code: string
      item_name: string | null
      findings: string | null
      assessment: string | null
      recommendation: string | null
      class_value: string | null
      recorded_by: number | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["medicalEvaluation"]>
    composites: {}
  }

  type MedicalEvaluationGetPayload<S extends boolean | null | undefined | MedicalEvaluationDefaultArgs> = $Result.GetResult<Prisma.$MedicalEvaluationPayload, S>

  type MedicalEvaluationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MedicalEvaluationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MedicalEvaluationCountAggregateInputType | true
    }

  export interface MedicalEvaluationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MedicalEvaluation'], meta: { name: 'MedicalEvaluation' } }
    /**
     * Find zero or one MedicalEvaluation that matches the filter.
     * @param {MedicalEvaluationFindUniqueArgs} args - Arguments to find a MedicalEvaluation
     * @example
     * // Get one MedicalEvaluation
     * const medicalEvaluation = await prisma.medicalEvaluation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MedicalEvaluationFindUniqueArgs>(args: SelectSubset<T, MedicalEvaluationFindUniqueArgs<ExtArgs>>): Prisma__MedicalEvaluationClient<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MedicalEvaluation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MedicalEvaluationFindUniqueOrThrowArgs} args - Arguments to find a MedicalEvaluation
     * @example
     * // Get one MedicalEvaluation
     * const medicalEvaluation = await prisma.medicalEvaluation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MedicalEvaluationFindUniqueOrThrowArgs>(args: SelectSubset<T, MedicalEvaluationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MedicalEvaluationClient<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MedicalEvaluation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicalEvaluationFindFirstArgs} args - Arguments to find a MedicalEvaluation
     * @example
     * // Get one MedicalEvaluation
     * const medicalEvaluation = await prisma.medicalEvaluation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MedicalEvaluationFindFirstArgs>(args?: SelectSubset<T, MedicalEvaluationFindFirstArgs<ExtArgs>>): Prisma__MedicalEvaluationClient<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MedicalEvaluation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicalEvaluationFindFirstOrThrowArgs} args - Arguments to find a MedicalEvaluation
     * @example
     * // Get one MedicalEvaluation
     * const medicalEvaluation = await prisma.medicalEvaluation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MedicalEvaluationFindFirstOrThrowArgs>(args?: SelectSubset<T, MedicalEvaluationFindFirstOrThrowArgs<ExtArgs>>): Prisma__MedicalEvaluationClient<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MedicalEvaluations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicalEvaluationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MedicalEvaluations
     * const medicalEvaluations = await prisma.medicalEvaluation.findMany()
     * 
     * // Get first 10 MedicalEvaluations
     * const medicalEvaluations = await prisma.medicalEvaluation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const medicalEvaluationWithIdOnly = await prisma.medicalEvaluation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MedicalEvaluationFindManyArgs>(args?: SelectSubset<T, MedicalEvaluationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MedicalEvaluation.
     * @param {MedicalEvaluationCreateArgs} args - Arguments to create a MedicalEvaluation.
     * @example
     * // Create one MedicalEvaluation
     * const MedicalEvaluation = await prisma.medicalEvaluation.create({
     *   data: {
     *     // ... data to create a MedicalEvaluation
     *   }
     * })
     * 
     */
    create<T extends MedicalEvaluationCreateArgs>(args: SelectSubset<T, MedicalEvaluationCreateArgs<ExtArgs>>): Prisma__MedicalEvaluationClient<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MedicalEvaluations.
     * @param {MedicalEvaluationCreateManyArgs} args - Arguments to create many MedicalEvaluations.
     * @example
     * // Create many MedicalEvaluations
     * const medicalEvaluation = await prisma.medicalEvaluation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MedicalEvaluationCreateManyArgs>(args?: SelectSubset<T, MedicalEvaluationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MedicalEvaluations and returns the data saved in the database.
     * @param {MedicalEvaluationCreateManyAndReturnArgs} args - Arguments to create many MedicalEvaluations.
     * @example
     * // Create many MedicalEvaluations
     * const medicalEvaluation = await prisma.medicalEvaluation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MedicalEvaluations and only return the `id`
     * const medicalEvaluationWithIdOnly = await prisma.medicalEvaluation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MedicalEvaluationCreateManyAndReturnArgs>(args?: SelectSubset<T, MedicalEvaluationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MedicalEvaluation.
     * @param {MedicalEvaluationDeleteArgs} args - Arguments to delete one MedicalEvaluation.
     * @example
     * // Delete one MedicalEvaluation
     * const MedicalEvaluation = await prisma.medicalEvaluation.delete({
     *   where: {
     *     // ... filter to delete one MedicalEvaluation
     *   }
     * })
     * 
     */
    delete<T extends MedicalEvaluationDeleteArgs>(args: SelectSubset<T, MedicalEvaluationDeleteArgs<ExtArgs>>): Prisma__MedicalEvaluationClient<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MedicalEvaluation.
     * @param {MedicalEvaluationUpdateArgs} args - Arguments to update one MedicalEvaluation.
     * @example
     * // Update one MedicalEvaluation
     * const medicalEvaluation = await prisma.medicalEvaluation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MedicalEvaluationUpdateArgs>(args: SelectSubset<T, MedicalEvaluationUpdateArgs<ExtArgs>>): Prisma__MedicalEvaluationClient<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MedicalEvaluations.
     * @param {MedicalEvaluationDeleteManyArgs} args - Arguments to filter MedicalEvaluations to delete.
     * @example
     * // Delete a few MedicalEvaluations
     * const { count } = await prisma.medicalEvaluation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MedicalEvaluationDeleteManyArgs>(args?: SelectSubset<T, MedicalEvaluationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MedicalEvaluations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicalEvaluationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MedicalEvaluations
     * const medicalEvaluation = await prisma.medicalEvaluation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MedicalEvaluationUpdateManyArgs>(args: SelectSubset<T, MedicalEvaluationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MedicalEvaluations and returns the data updated in the database.
     * @param {MedicalEvaluationUpdateManyAndReturnArgs} args - Arguments to update many MedicalEvaluations.
     * @example
     * // Update many MedicalEvaluations
     * const medicalEvaluation = await prisma.medicalEvaluation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MedicalEvaluations and only return the `id`
     * const medicalEvaluationWithIdOnly = await prisma.medicalEvaluation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MedicalEvaluationUpdateManyAndReturnArgs>(args: SelectSubset<T, MedicalEvaluationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MedicalEvaluation.
     * @param {MedicalEvaluationUpsertArgs} args - Arguments to update or create a MedicalEvaluation.
     * @example
     * // Update or create a MedicalEvaluation
     * const medicalEvaluation = await prisma.medicalEvaluation.upsert({
     *   create: {
     *     // ... data to create a MedicalEvaluation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MedicalEvaluation we want to update
     *   }
     * })
     */
    upsert<T extends MedicalEvaluationUpsertArgs>(args: SelectSubset<T, MedicalEvaluationUpsertArgs<ExtArgs>>): Prisma__MedicalEvaluationClient<$Result.GetResult<Prisma.$MedicalEvaluationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MedicalEvaluations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicalEvaluationCountArgs} args - Arguments to filter MedicalEvaluations to count.
     * @example
     * // Count the number of MedicalEvaluations
     * const count = await prisma.medicalEvaluation.count({
     *   where: {
     *     // ... the filter for the MedicalEvaluations we want to count
     *   }
     * })
    **/
    count<T extends MedicalEvaluationCountArgs>(
      args?: Subset<T, MedicalEvaluationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MedicalEvaluationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MedicalEvaluation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicalEvaluationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MedicalEvaluationAggregateArgs>(args: Subset<T, MedicalEvaluationAggregateArgs>): Prisma.PrismaPromise<GetMedicalEvaluationAggregateType<T>>

    /**
     * Group by MedicalEvaluation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MedicalEvaluationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MedicalEvaluationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MedicalEvaluationGroupByArgs['orderBy'] }
        : { orderBy?: MedicalEvaluationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MedicalEvaluationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMedicalEvaluationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MedicalEvaluation model
   */
  readonly fields: MedicalEvaluationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MedicalEvaluation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MedicalEvaluationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MedicalEvaluation model
   */
  interface MedicalEvaluationFieldRefs {
    readonly id: FieldRef<"MedicalEvaluation", 'Int'>
    readonly queue_id: FieldRef<"MedicalEvaluation", 'Int'>
    readonly patient_id: FieldRef<"MedicalEvaluation", 'String'>
    readonly item_code: FieldRef<"MedicalEvaluation", 'String'>
    readonly item_name: FieldRef<"MedicalEvaluation", 'String'>
    readonly findings: FieldRef<"MedicalEvaluation", 'String'>
    readonly assessment: FieldRef<"MedicalEvaluation", 'String'>
    readonly recommendation: FieldRef<"MedicalEvaluation", 'String'>
    readonly class_value: FieldRef<"MedicalEvaluation", 'String'>
    readonly recorded_by: FieldRef<"MedicalEvaluation", 'Int'>
    readonly created_at: FieldRef<"MedicalEvaluation", 'DateTime'>
    readonly updated_at: FieldRef<"MedicalEvaluation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MedicalEvaluation findUnique
   */
  export type MedicalEvaluationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which MedicalEvaluation to fetch.
     */
    where: MedicalEvaluationWhereUniqueInput
  }

  /**
   * MedicalEvaluation findUniqueOrThrow
   */
  export type MedicalEvaluationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which MedicalEvaluation to fetch.
     */
    where: MedicalEvaluationWhereUniqueInput
  }

  /**
   * MedicalEvaluation findFirst
   */
  export type MedicalEvaluationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which MedicalEvaluation to fetch.
     */
    where?: MedicalEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MedicalEvaluations to fetch.
     */
    orderBy?: MedicalEvaluationOrderByWithRelationInput | MedicalEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MedicalEvaluations.
     */
    cursor?: MedicalEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MedicalEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MedicalEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MedicalEvaluations.
     */
    distinct?: MedicalEvaluationScalarFieldEnum | MedicalEvaluationScalarFieldEnum[]
  }

  /**
   * MedicalEvaluation findFirstOrThrow
   */
  export type MedicalEvaluationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which MedicalEvaluation to fetch.
     */
    where?: MedicalEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MedicalEvaluations to fetch.
     */
    orderBy?: MedicalEvaluationOrderByWithRelationInput | MedicalEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MedicalEvaluations.
     */
    cursor?: MedicalEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MedicalEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MedicalEvaluations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MedicalEvaluations.
     */
    distinct?: MedicalEvaluationScalarFieldEnum | MedicalEvaluationScalarFieldEnum[]
  }

  /**
   * MedicalEvaluation findMany
   */
  export type MedicalEvaluationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * Filter, which MedicalEvaluations to fetch.
     */
    where?: MedicalEvaluationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MedicalEvaluations to fetch.
     */
    orderBy?: MedicalEvaluationOrderByWithRelationInput | MedicalEvaluationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MedicalEvaluations.
     */
    cursor?: MedicalEvaluationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MedicalEvaluations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MedicalEvaluations.
     */
    skip?: number
    distinct?: MedicalEvaluationScalarFieldEnum | MedicalEvaluationScalarFieldEnum[]
  }

  /**
   * MedicalEvaluation create
   */
  export type MedicalEvaluationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * The data needed to create a MedicalEvaluation.
     */
    data: XOR<MedicalEvaluationCreateInput, MedicalEvaluationUncheckedCreateInput>
  }

  /**
   * MedicalEvaluation createMany
   */
  export type MedicalEvaluationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MedicalEvaluations.
     */
    data: MedicalEvaluationCreateManyInput | MedicalEvaluationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MedicalEvaluation createManyAndReturn
   */
  export type MedicalEvaluationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * The data used to create many MedicalEvaluations.
     */
    data: MedicalEvaluationCreateManyInput | MedicalEvaluationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MedicalEvaluation update
   */
  export type MedicalEvaluationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * The data needed to update a MedicalEvaluation.
     */
    data: XOR<MedicalEvaluationUpdateInput, MedicalEvaluationUncheckedUpdateInput>
    /**
     * Choose, which MedicalEvaluation to update.
     */
    where: MedicalEvaluationWhereUniqueInput
  }

  /**
   * MedicalEvaluation updateMany
   */
  export type MedicalEvaluationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MedicalEvaluations.
     */
    data: XOR<MedicalEvaluationUpdateManyMutationInput, MedicalEvaluationUncheckedUpdateManyInput>
    /**
     * Filter which MedicalEvaluations to update
     */
    where?: MedicalEvaluationWhereInput
    /**
     * Limit how many MedicalEvaluations to update.
     */
    limit?: number
  }

  /**
   * MedicalEvaluation updateManyAndReturn
   */
  export type MedicalEvaluationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * The data used to update MedicalEvaluations.
     */
    data: XOR<MedicalEvaluationUpdateManyMutationInput, MedicalEvaluationUncheckedUpdateManyInput>
    /**
     * Filter which MedicalEvaluations to update
     */
    where?: MedicalEvaluationWhereInput
    /**
     * Limit how many MedicalEvaluations to update.
     */
    limit?: number
  }

  /**
   * MedicalEvaluation upsert
   */
  export type MedicalEvaluationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * The filter to search for the MedicalEvaluation to update in case it exists.
     */
    where: MedicalEvaluationWhereUniqueInput
    /**
     * In case the MedicalEvaluation found by the `where` argument doesn't exist, create a new MedicalEvaluation with this data.
     */
    create: XOR<MedicalEvaluationCreateInput, MedicalEvaluationUncheckedCreateInput>
    /**
     * In case the MedicalEvaluation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MedicalEvaluationUpdateInput, MedicalEvaluationUncheckedUpdateInput>
  }

  /**
   * MedicalEvaluation delete
   */
  export type MedicalEvaluationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
    /**
     * Filter which MedicalEvaluation to delete.
     */
    where: MedicalEvaluationWhereUniqueInput
  }

  /**
   * MedicalEvaluation deleteMany
   */
  export type MedicalEvaluationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MedicalEvaluations to delete
     */
    where?: MedicalEvaluationWhereInput
    /**
     * Limit how many MedicalEvaluations to delete.
     */
    limit?: number
  }

  /**
   * MedicalEvaluation without action
   */
  export type MedicalEvaluationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MedicalEvaluation
     */
    select?: MedicalEvaluationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MedicalEvaluation
     */
    omit?: MedicalEvaluationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password: 'password',
    permissions: 'permissions',
    activated: 'activated',
    created_by: 'created_by',
    activation_code: 'activation_code',
    activated_at: 'activated_at',
    last_login: 'last_login',
    persist_code: 'persist_code',
    reset_password_code: 'reset_password_code',
    first_name: 'first_name',
    last_name: 'last_name',
    created_at: 'created_at',
    updated_at: 'updated_at',
    deleted_at: 'deleted_at',
    website: 'website',
    country: 'country',
    gravatar: 'gravatar',
    location_id: 'location_id',
    phone: 'phone',
    jobtitle: 'jobtitle',
    manager_id: 'manager_id',
    employee_num: 'employee_num',
    avatar: 'avatar',
    username: 'username',
    notes: 'notes',
    company_id: 'company_id',
    remember_token: 'remember_token',
    ldap_import: 'ldap_import',
    locale: 'locale',
    show_in_list: 'show_in_list',
    two_factor_secret: 'two_factor_secret',
    two_factor_enrolled: 'two_factor_enrolled',
    two_factor_optin: 'two_factor_optin',
    department_id: 'department_id',
    address: 'address',
    city: 'city',
    state: 'state',
    zip: 'zip',
    skin: 'skin',
    remote: 'remote',
    status: 'status',
    role: 'role',
    department: 'department',
    accessmapid: 'accessmapid',
    ldap_server_status: 'ldap_server_status'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const QueueScalarFieldEnum: {
    id: 'id',
    idbu: 'idbu',
    code: 'code',
    Date: 'Date',
    antedatequeueid: 'antedatequeueid',
    antedate: 'antedate',
    antedatecode: 'antedatecode',
    antedatetime: 'antedatetime',
    antedatestatus: 'antedatestatus',
    antedatereason: 'antedatereason',
    antedateapprovedby: 'antedateapprovedby',
    antedateapproveddate: 'antedateapproveddate',
    datetime: 'datetime',
    idpatient: 'idpatient',
    qfullname: 'qfullname',
    qlastname: 'qlastname',
    qfirstname: 'qfirstname',
    qmiddlename: 'qmiddlename',
    qgender: 'qgender',
    qdob: 'qdob',
    qfulladdress: 'qfulladdress',
    agepatient: 'agepatient',
    status: 'status',
    accessionno: 'accessionno',
    notes: 'notes',
    cancelreason: 'cancelreason',
    patienttype: 'patienttype',
    picture: 'picture',
    inputby: 'inputby',
    lab2labid: 'lab2labid',
    labbarcode: 'labbarcode',
    labid: 'labid',
    updatedate: 'updatedate',
    updateby: 'updateby',
    erosstatus: 'erosstatus',
    systemupdatetime: 'systemupdatetime'
  };

  export type QueueScalarFieldEnum = (typeof QueueScalarFieldEnum)[keyof typeof QueueScalarFieldEnum]


  export const CmsVitalsScalarFieldEnum: {
    id: 'id',
    idqueue: 'idqueue',
    medication: 'medication',
    lastdose: 'lastdose',
    lastperiod: 'lastperiod',
    inputby: 'inputby',
    inputdatetime: 'inputdatetime'
  };

  export type CmsVitalsScalarFieldEnum = (typeof CmsVitalsScalarFieldEnum)[keyof typeof CmsVitalsScalarFieldEnum]


  export const PatientScalarFieldEnum: {
    id: 'id',
    code: 'code',
    fullname: 'fullname',
    lastname: 'lastname',
    firstname: 'firstname',
    middlename: 'middlename',
    suffix: 'suffix',
    prefix: 'prefix',
    gender: 'gender',
    dob: 'dob',
    email: 'email',
    fulladdress: 'fulladdress',
    address: 'address',
    barangay: 'barangay',
    barangayname: 'barangayname',
    city: 'city',
    cityname: 'cityname',
    state: 'state',
    zipcode: 'zipcode',
    nationality: 'nationality',
    country: 'country',
    religion: 'religion',
    contactno: 'contactno',
    moblie: 'moblie',
    faxno: 'faxno',
    philhealth: 'philhealth',
    seniorid: 'seniorid',
    pwd: 'pwd',
    expirydatepwd: 'expirydatepwd',
    status: 'status',
    isactive: 'isactive',
    remarks: 'remarks',
    picturelink: 'picturelink',
    uploadid: 'uploadid',
    inputdate: 'inputdate',
    inputby: 'inputby',
    updatedate: 'updatedate',
    updateby: 'updateby',
    lastvisit: 'lastvisit',
    passportno: 'passportno',
    employeeid: 'employeeid',
    rdob: 'rdob',
    uploaddatetime: 'uploaddatetime'
  };

  export type PatientScalarFieldEnum = (typeof PatientScalarFieldEnum)[keyof typeof PatientScalarFieldEnum]


  export const CardEnrollmentScalarFieldEnum: {
    id: 'id',
    cardnumber: 'cardnumber',
    dateenrolled: 'dateenrolled',
    receivedby: 'receivedby',
    receiveddate: 'receiveddate',
    releaseto: 'releaseto',
    oldreleaseto: 'oldreleaseto',
    releaseby: 'releaseby',
    daterelease: 'daterelease',
    transferto: 'transferto',
    datetransfer: 'datetransfer',
    transferby: 'transferby',
    status: 'status'
  };

  export type CardEnrollmentScalarFieldEnum = (typeof CardEnrollmentScalarFieldEnum)[keyof typeof CardEnrollmentScalarFieldEnum]


  export const CardNumberScalarFieldEnum: {
    id: 'id',
    year: 'year',
    batch: 'batch',
    month: 'month',
    seriesnum: 'seriesnum',
    maskedseries: 'maskedseries',
    generatedcardnumber: 'generatedcardnumber',
    codecompany: 'codecompany',
    generatedby: 'generatedby'
  };

  export type CardNumberScalarFieldEnum = (typeof CardNumberScalarFieldEnum)[keyof typeof CardNumberScalarFieldEnum]


  export const CardVerifiedScalarFieldEnum: {
    id: 'id',
    verifiedcardnumbers: 'verifiedcardnumbers',
    ictreceived: 'ictreceived',
    datereceived: 'datereceived'
  };

  export type CardVerifiedScalarFieldEnum = (typeof CardVerifiedScalarFieldEnum)[keyof typeof CardVerifiedScalarFieldEnum]


  export const CmsCompanyScalarFieldEnum: {
    id: 'id',
    server: 'server',
    idcompany: 'idcompany',
    code: 'code',
    name: 'name',
    status: 'status',
    billingtype: 'billingtype'
  };

  export type CmsCompanyScalarFieldEnum = (typeof CmsCompanyScalarFieldEnum)[keyof typeof CmsCompanyScalarFieldEnum]


  export const ConsultationNoteScalarFieldEnum: {
    id: 'id',
    queue_id: 'queue_id',
    patient_id: 'patient_id',
    status: 'status',
    is_draft: 'is_draft',
    chief_complaint: 'chief_complaint',
    history_illness: 'history_illness',
    past_history: 'past_history',
    family_history: 'family_history',
    pe_findings: 'pe_findings',
    diagnosis: 'diagnosis',
    icd_code: 'icd_code',
    treatment_plan: 'treatment_plan',
    orders: 'orders',
    pcp_doctor: 'pcp_doctor',
    doctor_id: 'doctor_id',
    doctor_name: 'doctor_name',
    recorded_by: 'recorded_by',
    completed_at: 'completed_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ConsultationNoteScalarFieldEnum = (typeof ConsultationNoteScalarFieldEnum)[keyof typeof ConsultationNoteScalarFieldEnum]


  export const VitalsScalarFieldEnum: {
    id: 'id',
    queue_id: 'queue_id',
    patient_id: 'patient_id',
    bp_systolic: 'bp_systolic',
    bp_diastolic: 'bp_diastolic',
    bp_systolic2: 'bp_systolic2',
    bp_diastolic2: 'bp_diastolic2',
    bp_systolic3: 'bp_systolic3',
    bp_diastolic3: 'bp_diastolic3',
    heart_rate: 'heart_rate',
    temperature: 'temperature',
    respiratory_rate: 'respiratory_rate',
    o2_saturation: 'o2_saturation',
    weight_kg: 'weight_kg',
    height_cm: 'height_cm',
    bmi: 'bmi',
    vision_right_od: 'vision_right_od',
    vision_left_os: 'vision_left_os',
    vision_corrected: 'vision_corrected',
    color_vision: 'color_vision',
    chief_complaint: 'chief_complaint',
    pcp_doctor: 'pcp_doctor',
    recorded_by: 'recorded_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type VitalsScalarFieldEnum = (typeof VitalsScalarFieldEnum)[keyof typeof VitalsScalarFieldEnum]


  export const PhysicalExaminationScalarFieldEnum: {
    id: 'id',
    queue_id: 'queue_id',
    patient_id: 'patient_id',
    hypertension: 'hypertension',
    diabetes: 'diabetes',
    asthma: 'asthma',
    heart_disease: 'heart_disease',
    thyroid_disease: 'thyroid_disease',
    kidney_disease: 'kidney_disease',
    allergies: 'allergies',
    allergies_specify: 'allergies_specify',
    surgery_history: 'surgery_history',
    surgery_specify: 'surgery_specify',
    smoker: 'smoker',
    pack_years: 'pack_years',
    alcoholic: 'alcoholic',
    lmp: 'lmp',
    gravida: 'gravida',
    para: 'para',
    family_hypertension: 'family_hypertension',
    family_diabetes: 'family_diabetes',
    family_cancer: 'family_cancer',
    skin: 'skin',
    heent: 'heent',
    neck: 'neck',
    chest_lungs: 'chest_lungs',
    heart: 'heart',
    abdomen: 'abdomen',
    extremities: 'extremities',
    neurological: 'neurological',
    fitness_class: 'fitness_class',
    recorded_by: 'recorded_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type PhysicalExaminationScalarFieldEnum = (typeof PhysicalExaminationScalarFieldEnum)[keyof typeof PhysicalExaminationScalarFieldEnum]


  export const MedicalEvaluationScalarFieldEnum: {
    id: 'id',
    queue_id: 'queue_id',
    patient_id: 'patient_id',
    item_code: 'item_code',
    item_name: 'item_name',
    findings: 'findings',
    assessment: 'assessment',
    recommendation: 'recommendation',
    class_value: 'class_value',
    recorded_by: 'recorded_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type MedicalEvaluationScalarFieldEnum = (typeof MedicalEvaluationScalarFieldEnum)[keyof typeof MedicalEvaluationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    email?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    permissions?: StringNullableFilter<"User"> | string | null
    activated?: BoolFilter<"User"> | boolean
    created_by?: IntNullableFilter<"User"> | number | null
    activation_code?: StringNullableFilter<"User"> | string | null
    activated_at?: DateTimeNullableFilter<"User"> | Date | string | null
    last_login?: DateTimeNullableFilter<"User"> | Date | string | null
    persist_code?: StringNullableFilter<"User"> | string | null
    reset_password_code?: StringNullableFilter<"User"> | string | null
    first_name?: StringNullableFilter<"User"> | string | null
    last_name?: StringNullableFilter<"User"> | string | null
    created_at?: DateTimeNullableFilter<"User"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"User"> | Date | string | null
    deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    website?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    gravatar?: StringNullableFilter<"User"> | string | null
    location_id?: IntNullableFilter<"User"> | number | null
    phone?: StringNullableFilter<"User"> | string | null
    jobtitle?: StringNullableFilter<"User"> | string | null
    manager_id?: IntNullableFilter<"User"> | number | null
    employee_num?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    username?: StringNullableFilter<"User"> | string | null
    notes?: StringNullableFilter<"User"> | string | null
    company_id?: IntNullableFilter<"User"> | number | null
    remember_token?: StringNullableFilter<"User"> | string | null
    ldap_import?: BoolFilter<"User"> | boolean
    locale?: StringNullableFilter<"User"> | string | null
    show_in_list?: BoolFilter<"User"> | boolean
    two_factor_secret?: StringNullableFilter<"User"> | string | null
    two_factor_enrolled?: BoolFilter<"User"> | boolean
    two_factor_optin?: BoolFilter<"User"> | boolean
    department_id?: IntNullableFilter<"User"> | number | null
    address?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    state?: StringNullableFilter<"User"> | string | null
    zip?: StringNullableFilter<"User"> | string | null
    skin?: StringNullableFilter<"User"> | string | null
    remote?: IntNullableFilter<"User"> | number | null
    status?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    department?: StringNullableFilter<"User"> | string | null
    accessmapid?: StringNullableFilter<"User"> | string | null
    ldap_server_status?: StringNullableFilter<"User"> | string | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    permissions?: SortOrderInput | SortOrder
    activated?: SortOrder
    created_by?: SortOrderInput | SortOrder
    activation_code?: SortOrderInput | SortOrder
    activated_at?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    persist_code?: SortOrderInput | SortOrder
    reset_password_code?: SortOrderInput | SortOrder
    first_name?: SortOrderInput | SortOrder
    last_name?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    deleted_at?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    gravatar?: SortOrderInput | SortOrder
    location_id?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    jobtitle?: SortOrderInput | SortOrder
    manager_id?: SortOrderInput | SortOrder
    employee_num?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    company_id?: SortOrderInput | SortOrder
    remember_token?: SortOrderInput | SortOrder
    ldap_import?: SortOrder
    locale?: SortOrderInput | SortOrder
    show_in_list?: SortOrder
    two_factor_secret?: SortOrderInput | SortOrder
    two_factor_enrolled?: SortOrder
    two_factor_optin?: SortOrder
    department_id?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zip?: SortOrderInput | SortOrder
    skin?: SortOrderInput | SortOrder
    remote?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    accessmapid?: SortOrderInput | SortOrder
    ldap_server_status?: SortOrderInput | SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    email?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    permissions?: StringNullableFilter<"User"> | string | null
    activated?: BoolFilter<"User"> | boolean
    created_by?: IntNullableFilter<"User"> | number | null
    activation_code?: StringNullableFilter<"User"> | string | null
    activated_at?: DateTimeNullableFilter<"User"> | Date | string | null
    last_login?: DateTimeNullableFilter<"User"> | Date | string | null
    persist_code?: StringNullableFilter<"User"> | string | null
    reset_password_code?: StringNullableFilter<"User"> | string | null
    first_name?: StringNullableFilter<"User"> | string | null
    last_name?: StringNullableFilter<"User"> | string | null
    created_at?: DateTimeNullableFilter<"User"> | Date | string | null
    updated_at?: DateTimeNullableFilter<"User"> | Date | string | null
    deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    website?: StringNullableFilter<"User"> | string | null
    country?: StringNullableFilter<"User"> | string | null
    gravatar?: StringNullableFilter<"User"> | string | null
    location_id?: IntNullableFilter<"User"> | number | null
    phone?: StringNullableFilter<"User"> | string | null
    jobtitle?: StringNullableFilter<"User"> | string | null
    manager_id?: IntNullableFilter<"User"> | number | null
    employee_num?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    notes?: StringNullableFilter<"User"> | string | null
    company_id?: IntNullableFilter<"User"> | number | null
    remember_token?: StringNullableFilter<"User"> | string | null
    ldap_import?: BoolFilter<"User"> | boolean
    locale?: StringNullableFilter<"User"> | string | null
    show_in_list?: BoolFilter<"User"> | boolean
    two_factor_secret?: StringNullableFilter<"User"> | string | null
    two_factor_enrolled?: BoolFilter<"User"> | boolean
    two_factor_optin?: BoolFilter<"User"> | boolean
    department_id?: IntNullableFilter<"User"> | number | null
    address?: StringNullableFilter<"User"> | string | null
    city?: StringNullableFilter<"User"> | string | null
    state?: StringNullableFilter<"User"> | string | null
    zip?: StringNullableFilter<"User"> | string | null
    skin?: StringNullableFilter<"User"> | string | null
    remote?: IntNullableFilter<"User"> | number | null
    status?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    department?: StringNullableFilter<"User"> | string | null
    accessmapid?: StringNullableFilter<"User"> | string | null
    ldap_server_status?: StringNullableFilter<"User"> | string | null
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    permissions?: SortOrderInput | SortOrder
    activated?: SortOrder
    created_by?: SortOrderInput | SortOrder
    activation_code?: SortOrderInput | SortOrder
    activated_at?: SortOrderInput | SortOrder
    last_login?: SortOrderInput | SortOrder
    persist_code?: SortOrderInput | SortOrder
    reset_password_code?: SortOrderInput | SortOrder
    first_name?: SortOrderInput | SortOrder
    last_name?: SortOrderInput | SortOrder
    created_at?: SortOrderInput | SortOrder
    updated_at?: SortOrderInput | SortOrder
    deleted_at?: SortOrderInput | SortOrder
    website?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    gravatar?: SortOrderInput | SortOrder
    location_id?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    jobtitle?: SortOrderInput | SortOrder
    manager_id?: SortOrderInput | SortOrder
    employee_num?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    company_id?: SortOrderInput | SortOrder
    remember_token?: SortOrderInput | SortOrder
    ldap_import?: SortOrder
    locale?: SortOrderInput | SortOrder
    show_in_list?: SortOrder
    two_factor_secret?: SortOrderInput | SortOrder
    two_factor_enrolled?: SortOrder
    two_factor_optin?: SortOrder
    department_id?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zip?: SortOrderInput | SortOrder
    skin?: SortOrderInput | SortOrder
    remote?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    accessmapid?: SortOrderInput | SortOrder
    ldap_server_status?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    permissions?: StringNullableWithAggregatesFilter<"User"> | string | null
    activated?: BoolWithAggregatesFilter<"User"> | boolean
    created_by?: IntNullableWithAggregatesFilter<"User"> | number | null
    activation_code?: StringNullableWithAggregatesFilter<"User"> | string | null
    activated_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    last_login?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    persist_code?: StringNullableWithAggregatesFilter<"User"> | string | null
    reset_password_code?: StringNullableWithAggregatesFilter<"User"> | string | null
    first_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    last_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    created_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    updated_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    deleted_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    website?: StringNullableWithAggregatesFilter<"User"> | string | null
    country?: StringNullableWithAggregatesFilter<"User"> | string | null
    gravatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    location_id?: IntNullableWithAggregatesFilter<"User"> | number | null
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    jobtitle?: StringNullableWithAggregatesFilter<"User"> | string | null
    manager_id?: IntNullableWithAggregatesFilter<"User"> | number | null
    employee_num?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    notes?: StringNullableWithAggregatesFilter<"User"> | string | null
    company_id?: IntNullableWithAggregatesFilter<"User"> | number | null
    remember_token?: StringNullableWithAggregatesFilter<"User"> | string | null
    ldap_import?: BoolWithAggregatesFilter<"User"> | boolean
    locale?: StringNullableWithAggregatesFilter<"User"> | string | null
    show_in_list?: BoolWithAggregatesFilter<"User"> | boolean
    two_factor_secret?: StringNullableWithAggregatesFilter<"User"> | string | null
    two_factor_enrolled?: BoolWithAggregatesFilter<"User"> | boolean
    two_factor_optin?: BoolWithAggregatesFilter<"User"> | boolean
    department_id?: IntNullableWithAggregatesFilter<"User"> | number | null
    address?: StringNullableWithAggregatesFilter<"User"> | string | null
    city?: StringNullableWithAggregatesFilter<"User"> | string | null
    state?: StringNullableWithAggregatesFilter<"User"> | string | null
    zip?: StringNullableWithAggregatesFilter<"User"> | string | null
    skin?: StringNullableWithAggregatesFilter<"User"> | string | null
    remote?: IntNullableWithAggregatesFilter<"User"> | number | null
    status?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringNullableWithAggregatesFilter<"User"> | string | null
    department?: StringNullableWithAggregatesFilter<"User"> | string | null
    accessmapid?: StringNullableWithAggregatesFilter<"User"> | string | null
    ldap_server_status?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type QueueWhereInput = {
    AND?: QueueWhereInput | QueueWhereInput[]
    OR?: QueueWhereInput[]
    NOT?: QueueWhereInput | QueueWhereInput[]
    id?: BigIntFilter<"Queue"> | bigint | number
    idbu?: StringNullableFilter<"Queue"> | string | null
    code?: StringNullableFilter<"Queue"> | string | null
    Date?: DateTimeFilter<"Queue"> | Date | string
    antedatequeueid?: BigIntNullableFilter<"Queue"> | bigint | number | null
    antedate?: DateTimeNullableFilter<"Queue"> | Date | string | null
    antedatecode?: StringNullableFilter<"Queue"> | string | null
    antedatetime?: DateTimeNullableFilter<"Queue"> | Date | string | null
    antedatestatus?: IntFilter<"Queue"> | number
    antedatereason?: StringNullableFilter<"Queue"> | string | null
    antedateapprovedby?: StringNullableFilter<"Queue"> | string | null
    antedateapproveddate?: DateTimeNullableFilter<"Queue"> | Date | string | null
    datetime?: DateTimeFilter<"Queue"> | Date | string
    idpatient?: BigIntFilter<"Queue"> | bigint | number
    qfullname?: StringNullableFilter<"Queue"> | string | null
    qlastname?: StringNullableFilter<"Queue"> | string | null
    qfirstname?: StringNullableFilter<"Queue"> | string | null
    qmiddlename?: StringNullableFilter<"Queue"> | string | null
    qgender?: StringNullableFilter<"Queue"> | string | null
    qdob?: DateTimeNullableFilter<"Queue"> | Date | string | null
    qfulladdress?: StringNullableFilter<"Queue"> | string | null
    agepatient?: IntNullableFilter<"Queue"> | number | null
    status?: IntFilter<"Queue"> | number
    accessionno?: StringNullableFilter<"Queue"> | string | null
    notes?: StringNullableFilter<"Queue"> | string | null
    cancelreason?: StringNullableFilter<"Queue"> | string | null
    patienttype?: StringNullableFilter<"Queue"> | string | null
    picture?: StringNullableFilter<"Queue"> | string | null
    inputby?: StringNullableFilter<"Queue"> | string | null
    lab2labid?: StringNullableFilter<"Queue"> | string | null
    labbarcode?: StringNullableFilter<"Queue"> | string | null
    labid?: StringNullableFilter<"Queue"> | string | null
    updatedate?: DateTimeNullableFilter<"Queue"> | Date | string | null
    updateby?: StringNullableFilter<"Queue"> | string | null
    erosstatus?: StringNullableFilter<"Queue"> | string | null
    systemupdatetime?: DateTimeNullableFilter<"Queue"> | Date | string | null
  }

  export type QueueOrderByWithRelationInput = {
    id?: SortOrder
    idbu?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    Date?: SortOrder
    antedatequeueid?: SortOrderInput | SortOrder
    antedate?: SortOrderInput | SortOrder
    antedatecode?: SortOrderInput | SortOrder
    antedatetime?: SortOrderInput | SortOrder
    antedatestatus?: SortOrder
    antedatereason?: SortOrderInput | SortOrder
    antedateapprovedby?: SortOrderInput | SortOrder
    antedateapproveddate?: SortOrderInput | SortOrder
    datetime?: SortOrder
    idpatient?: SortOrder
    qfullname?: SortOrderInput | SortOrder
    qlastname?: SortOrderInput | SortOrder
    qfirstname?: SortOrderInput | SortOrder
    qmiddlename?: SortOrderInput | SortOrder
    qgender?: SortOrderInput | SortOrder
    qdob?: SortOrderInput | SortOrder
    qfulladdress?: SortOrderInput | SortOrder
    agepatient?: SortOrderInput | SortOrder
    status?: SortOrder
    accessionno?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    cancelreason?: SortOrderInput | SortOrder
    patienttype?: SortOrderInput | SortOrder
    picture?: SortOrderInput | SortOrder
    inputby?: SortOrderInput | SortOrder
    lab2labid?: SortOrderInput | SortOrder
    labbarcode?: SortOrderInput | SortOrder
    labid?: SortOrderInput | SortOrder
    updatedate?: SortOrderInput | SortOrder
    updateby?: SortOrderInput | SortOrder
    erosstatus?: SortOrderInput | SortOrder
    systemupdatetime?: SortOrderInput | SortOrder
  }

  export type QueueWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: QueueWhereInput | QueueWhereInput[]
    OR?: QueueWhereInput[]
    NOT?: QueueWhereInput | QueueWhereInput[]
    idbu?: StringNullableFilter<"Queue"> | string | null
    code?: StringNullableFilter<"Queue"> | string | null
    Date?: DateTimeFilter<"Queue"> | Date | string
    antedatequeueid?: BigIntNullableFilter<"Queue"> | bigint | number | null
    antedate?: DateTimeNullableFilter<"Queue"> | Date | string | null
    antedatecode?: StringNullableFilter<"Queue"> | string | null
    antedatetime?: DateTimeNullableFilter<"Queue"> | Date | string | null
    antedatestatus?: IntFilter<"Queue"> | number
    antedatereason?: StringNullableFilter<"Queue"> | string | null
    antedateapprovedby?: StringNullableFilter<"Queue"> | string | null
    antedateapproveddate?: DateTimeNullableFilter<"Queue"> | Date | string | null
    datetime?: DateTimeFilter<"Queue"> | Date | string
    idpatient?: BigIntFilter<"Queue"> | bigint | number
    qfullname?: StringNullableFilter<"Queue"> | string | null
    qlastname?: StringNullableFilter<"Queue"> | string | null
    qfirstname?: StringNullableFilter<"Queue"> | string | null
    qmiddlename?: StringNullableFilter<"Queue"> | string | null
    qgender?: StringNullableFilter<"Queue"> | string | null
    qdob?: DateTimeNullableFilter<"Queue"> | Date | string | null
    qfulladdress?: StringNullableFilter<"Queue"> | string | null
    agepatient?: IntNullableFilter<"Queue"> | number | null
    status?: IntFilter<"Queue"> | number
    accessionno?: StringNullableFilter<"Queue"> | string | null
    notes?: StringNullableFilter<"Queue"> | string | null
    cancelreason?: StringNullableFilter<"Queue"> | string | null
    patienttype?: StringNullableFilter<"Queue"> | string | null
    picture?: StringNullableFilter<"Queue"> | string | null
    inputby?: StringNullableFilter<"Queue"> | string | null
    lab2labid?: StringNullableFilter<"Queue"> | string | null
    labbarcode?: StringNullableFilter<"Queue"> | string | null
    labid?: StringNullableFilter<"Queue"> | string | null
    updatedate?: DateTimeNullableFilter<"Queue"> | Date | string | null
    updateby?: StringNullableFilter<"Queue"> | string | null
    erosstatus?: StringNullableFilter<"Queue"> | string | null
    systemupdatetime?: DateTimeNullableFilter<"Queue"> | Date | string | null
  }, "id">

  export type QueueOrderByWithAggregationInput = {
    id?: SortOrder
    idbu?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    Date?: SortOrder
    antedatequeueid?: SortOrderInput | SortOrder
    antedate?: SortOrderInput | SortOrder
    antedatecode?: SortOrderInput | SortOrder
    antedatetime?: SortOrderInput | SortOrder
    antedatestatus?: SortOrder
    antedatereason?: SortOrderInput | SortOrder
    antedateapprovedby?: SortOrderInput | SortOrder
    antedateapproveddate?: SortOrderInput | SortOrder
    datetime?: SortOrder
    idpatient?: SortOrder
    qfullname?: SortOrderInput | SortOrder
    qlastname?: SortOrderInput | SortOrder
    qfirstname?: SortOrderInput | SortOrder
    qmiddlename?: SortOrderInput | SortOrder
    qgender?: SortOrderInput | SortOrder
    qdob?: SortOrderInput | SortOrder
    qfulladdress?: SortOrderInput | SortOrder
    agepatient?: SortOrderInput | SortOrder
    status?: SortOrder
    accessionno?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    cancelreason?: SortOrderInput | SortOrder
    patienttype?: SortOrderInput | SortOrder
    picture?: SortOrderInput | SortOrder
    inputby?: SortOrderInput | SortOrder
    lab2labid?: SortOrderInput | SortOrder
    labbarcode?: SortOrderInput | SortOrder
    labid?: SortOrderInput | SortOrder
    updatedate?: SortOrderInput | SortOrder
    updateby?: SortOrderInput | SortOrder
    erosstatus?: SortOrderInput | SortOrder
    systemupdatetime?: SortOrderInput | SortOrder
    _count?: QueueCountOrderByAggregateInput
    _avg?: QueueAvgOrderByAggregateInput
    _max?: QueueMaxOrderByAggregateInput
    _min?: QueueMinOrderByAggregateInput
    _sum?: QueueSumOrderByAggregateInput
  }

  export type QueueScalarWhereWithAggregatesInput = {
    AND?: QueueScalarWhereWithAggregatesInput | QueueScalarWhereWithAggregatesInput[]
    OR?: QueueScalarWhereWithAggregatesInput[]
    NOT?: QueueScalarWhereWithAggregatesInput | QueueScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Queue"> | bigint | number
    idbu?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    code?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    Date?: DateTimeWithAggregatesFilter<"Queue"> | Date | string
    antedatequeueid?: BigIntNullableWithAggregatesFilter<"Queue"> | bigint | number | null
    antedate?: DateTimeNullableWithAggregatesFilter<"Queue"> | Date | string | null
    antedatecode?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    antedatetime?: DateTimeNullableWithAggregatesFilter<"Queue"> | Date | string | null
    antedatestatus?: IntWithAggregatesFilter<"Queue"> | number
    antedatereason?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    antedateapprovedby?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    antedateapproveddate?: DateTimeNullableWithAggregatesFilter<"Queue"> | Date | string | null
    datetime?: DateTimeWithAggregatesFilter<"Queue"> | Date | string
    idpatient?: BigIntWithAggregatesFilter<"Queue"> | bigint | number
    qfullname?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    qlastname?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    qfirstname?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    qmiddlename?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    qgender?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    qdob?: DateTimeNullableWithAggregatesFilter<"Queue"> | Date | string | null
    qfulladdress?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    agepatient?: IntNullableWithAggregatesFilter<"Queue"> | number | null
    status?: IntWithAggregatesFilter<"Queue"> | number
    accessionno?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    cancelreason?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    patienttype?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    picture?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    inputby?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    lab2labid?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    labbarcode?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    labid?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    updatedate?: DateTimeNullableWithAggregatesFilter<"Queue"> | Date | string | null
    updateby?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    erosstatus?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    systemupdatetime?: DateTimeNullableWithAggregatesFilter<"Queue"> | Date | string | null
  }

  export type CmsVitalsWhereInput = {
    AND?: CmsVitalsWhereInput | CmsVitalsWhereInput[]
    OR?: CmsVitalsWhereInput[]
    NOT?: CmsVitalsWhereInput | CmsVitalsWhereInput[]
    id?: BigIntFilter<"CmsVitals"> | bigint | number
    idqueue?: BigIntFilter<"CmsVitals"> | bigint | number
    medication?: StringNullableFilter<"CmsVitals"> | string | null
    lastdose?: DateTimeNullableFilter<"CmsVitals"> | Date | string | null
    lastperiod?: DateTimeNullableFilter<"CmsVitals"> | Date | string | null
    inputby?: StringNullableFilter<"CmsVitals"> | string | null
    inputdatetime?: DateTimeNullableFilter<"CmsVitals"> | Date | string | null
  }

  export type CmsVitalsOrderByWithRelationInput = {
    id?: SortOrder
    idqueue?: SortOrder
    medication?: SortOrderInput | SortOrder
    lastdose?: SortOrderInput | SortOrder
    lastperiod?: SortOrderInput | SortOrder
    inputby?: SortOrderInput | SortOrder
    inputdatetime?: SortOrderInput | SortOrder
  }

  export type CmsVitalsWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: CmsVitalsWhereInput | CmsVitalsWhereInput[]
    OR?: CmsVitalsWhereInput[]
    NOT?: CmsVitalsWhereInput | CmsVitalsWhereInput[]
    idqueue?: BigIntFilter<"CmsVitals"> | bigint | number
    medication?: StringNullableFilter<"CmsVitals"> | string | null
    lastdose?: DateTimeNullableFilter<"CmsVitals"> | Date | string | null
    lastperiod?: DateTimeNullableFilter<"CmsVitals"> | Date | string | null
    inputby?: StringNullableFilter<"CmsVitals"> | string | null
    inputdatetime?: DateTimeNullableFilter<"CmsVitals"> | Date | string | null
  }, "id">

  export type CmsVitalsOrderByWithAggregationInput = {
    id?: SortOrder
    idqueue?: SortOrder
    medication?: SortOrderInput | SortOrder
    lastdose?: SortOrderInput | SortOrder
    lastperiod?: SortOrderInput | SortOrder
    inputby?: SortOrderInput | SortOrder
    inputdatetime?: SortOrderInput | SortOrder
    _count?: CmsVitalsCountOrderByAggregateInput
    _avg?: CmsVitalsAvgOrderByAggregateInput
    _max?: CmsVitalsMaxOrderByAggregateInput
    _min?: CmsVitalsMinOrderByAggregateInput
    _sum?: CmsVitalsSumOrderByAggregateInput
  }

  export type CmsVitalsScalarWhereWithAggregatesInput = {
    AND?: CmsVitalsScalarWhereWithAggregatesInput | CmsVitalsScalarWhereWithAggregatesInput[]
    OR?: CmsVitalsScalarWhereWithAggregatesInput[]
    NOT?: CmsVitalsScalarWhereWithAggregatesInput | CmsVitalsScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"CmsVitals"> | bigint | number
    idqueue?: BigIntWithAggregatesFilter<"CmsVitals"> | bigint | number
    medication?: StringNullableWithAggregatesFilter<"CmsVitals"> | string | null
    lastdose?: DateTimeNullableWithAggregatesFilter<"CmsVitals"> | Date | string | null
    lastperiod?: DateTimeNullableWithAggregatesFilter<"CmsVitals"> | Date | string | null
    inputby?: StringNullableWithAggregatesFilter<"CmsVitals"> | string | null
    inputdatetime?: DateTimeNullableWithAggregatesFilter<"CmsVitals"> | Date | string | null
  }

  export type PatientWhereInput = {
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    id?: BigIntFilter<"Patient"> | bigint | number
    code?: StringNullableFilter<"Patient"> | string | null
    fullname?: StringNullableFilter<"Patient"> | string | null
    lastname?: StringNullableFilter<"Patient"> | string | null
    firstname?: StringNullableFilter<"Patient"> | string | null
    middlename?: StringNullableFilter<"Patient"> | string | null
    suffix?: StringNullableFilter<"Patient"> | string | null
    prefix?: StringNullableFilter<"Patient"> | string | null
    gender?: StringNullableFilter<"Patient"> | string | null
    dob?: DateTimeFilter<"Patient"> | Date | string
    email?: StringNullableFilter<"Patient"> | string | null
    fulladdress?: StringNullableFilter<"Patient"> | string | null
    address?: StringNullableFilter<"Patient"> | string | null
    barangay?: StringNullableFilter<"Patient"> | string | null
    barangayname?: StringNullableFilter<"Patient"> | string | null
    city?: StringNullableFilter<"Patient"> | string | null
    cityname?: StringNullableFilter<"Patient"> | string | null
    state?: StringNullableFilter<"Patient"> | string | null
    zipcode?: StringNullableFilter<"Patient"> | string | null
    nationality?: StringNullableFilter<"Patient"> | string | null
    country?: StringNullableFilter<"Patient"> | string | null
    religion?: StringNullableFilter<"Patient"> | string | null
    contactno?: StringNullableFilter<"Patient"> | string | null
    moblie?: StringNullableFilter<"Patient"> | string | null
    faxno?: StringNullableFilter<"Patient"> | string | null
    philhealth?: StringNullableFilter<"Patient"> | string | null
    seniorid?: StringNullableFilter<"Patient"> | string | null
    pwd?: StringNullableFilter<"Patient"> | string | null
    expirydatepwd?: DateTimeNullableFilter<"Patient"> | Date | string | null
    status?: StringNullableFilter<"Patient"> | string | null
    isactive?: IntFilter<"Patient"> | number
    remarks?: StringNullableFilter<"Patient"> | string | null
    picturelink?: StringNullableFilter<"Patient"> | string | null
    uploadid?: StringNullableFilter<"Patient"> | string | null
    inputdate?: DateTimeNullableFilter<"Patient"> | Date | string | null
    inputby?: StringNullableFilter<"Patient"> | string | null
    updatedate?: DateTimeNullableFilter<"Patient"> | Date | string | null
    updateby?: StringNullableFilter<"Patient"> | string | null
    lastvisit?: DateTimeNullableFilter<"Patient"> | Date | string | null
    passportno?: StringNullableFilter<"Patient"> | string | null
    employeeid?: StringNullableFilter<"Patient"> | string | null
    rdob?: StringNullableFilter<"Patient"> | string | null
    uploaddatetime?: DateTimeFilter<"Patient"> | Date | string
  }

  export type PatientOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrderInput | SortOrder
    fullname?: SortOrderInput | SortOrder
    lastname?: SortOrderInput | SortOrder
    firstname?: SortOrderInput | SortOrder
    middlename?: SortOrderInput | SortOrder
    suffix?: SortOrderInput | SortOrder
    prefix?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    dob?: SortOrder
    email?: SortOrderInput | SortOrder
    fulladdress?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    barangay?: SortOrderInput | SortOrder
    barangayname?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    cityname?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zipcode?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    religion?: SortOrderInput | SortOrder
    contactno?: SortOrderInput | SortOrder
    moblie?: SortOrderInput | SortOrder
    faxno?: SortOrderInput | SortOrder
    philhealth?: SortOrderInput | SortOrder
    seniorid?: SortOrderInput | SortOrder
    pwd?: SortOrderInput | SortOrder
    expirydatepwd?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    isactive?: SortOrder
    remarks?: SortOrderInput | SortOrder
    picturelink?: SortOrderInput | SortOrder
    uploadid?: SortOrderInput | SortOrder
    inputdate?: SortOrderInput | SortOrder
    inputby?: SortOrderInput | SortOrder
    updatedate?: SortOrderInput | SortOrder
    updateby?: SortOrderInput | SortOrder
    lastvisit?: SortOrderInput | SortOrder
    passportno?: SortOrderInput | SortOrder
    employeeid?: SortOrderInput | SortOrder
    rdob?: SortOrderInput | SortOrder
    uploaddatetime?: SortOrder
  }

  export type PatientWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: PatientWhereInput | PatientWhereInput[]
    OR?: PatientWhereInput[]
    NOT?: PatientWhereInput | PatientWhereInput[]
    code?: StringNullableFilter<"Patient"> | string | null
    fullname?: StringNullableFilter<"Patient"> | string | null
    lastname?: StringNullableFilter<"Patient"> | string | null
    firstname?: StringNullableFilter<"Patient"> | string | null
    middlename?: StringNullableFilter<"Patient"> | string | null
    suffix?: StringNullableFilter<"Patient"> | string | null
    prefix?: StringNullableFilter<"Patient"> | string | null
    gender?: StringNullableFilter<"Patient"> | string | null
    dob?: DateTimeFilter<"Patient"> | Date | string
    email?: StringNullableFilter<"Patient"> | string | null
    fulladdress?: StringNullableFilter<"Patient"> | string | null
    address?: StringNullableFilter<"Patient"> | string | null
    barangay?: StringNullableFilter<"Patient"> | string | null
    barangayname?: StringNullableFilter<"Patient"> | string | null
    city?: StringNullableFilter<"Patient"> | string | null
    cityname?: StringNullableFilter<"Patient"> | string | null
    state?: StringNullableFilter<"Patient"> | string | null
    zipcode?: StringNullableFilter<"Patient"> | string | null
    nationality?: StringNullableFilter<"Patient"> | string | null
    country?: StringNullableFilter<"Patient"> | string | null
    religion?: StringNullableFilter<"Patient"> | string | null
    contactno?: StringNullableFilter<"Patient"> | string | null
    moblie?: StringNullableFilter<"Patient"> | string | null
    faxno?: StringNullableFilter<"Patient"> | string | null
    philhealth?: StringNullableFilter<"Patient"> | string | null
    seniorid?: StringNullableFilter<"Patient"> | string | null
    pwd?: StringNullableFilter<"Patient"> | string | null
    expirydatepwd?: DateTimeNullableFilter<"Patient"> | Date | string | null
    status?: StringNullableFilter<"Patient"> | string | null
    isactive?: IntFilter<"Patient"> | number
    remarks?: StringNullableFilter<"Patient"> | string | null
    picturelink?: StringNullableFilter<"Patient"> | string | null
    uploadid?: StringNullableFilter<"Patient"> | string | null
    inputdate?: DateTimeNullableFilter<"Patient"> | Date | string | null
    inputby?: StringNullableFilter<"Patient"> | string | null
    updatedate?: DateTimeNullableFilter<"Patient"> | Date | string | null
    updateby?: StringNullableFilter<"Patient"> | string | null
    lastvisit?: DateTimeNullableFilter<"Patient"> | Date | string | null
    passportno?: StringNullableFilter<"Patient"> | string | null
    employeeid?: StringNullableFilter<"Patient"> | string | null
    rdob?: StringNullableFilter<"Patient"> | string | null
    uploaddatetime?: DateTimeFilter<"Patient"> | Date | string
  }, "id">

  export type PatientOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrderInput | SortOrder
    fullname?: SortOrderInput | SortOrder
    lastname?: SortOrderInput | SortOrder
    firstname?: SortOrderInput | SortOrder
    middlename?: SortOrderInput | SortOrder
    suffix?: SortOrderInput | SortOrder
    prefix?: SortOrderInput | SortOrder
    gender?: SortOrderInput | SortOrder
    dob?: SortOrder
    email?: SortOrderInput | SortOrder
    fulladdress?: SortOrderInput | SortOrder
    address?: SortOrderInput | SortOrder
    barangay?: SortOrderInput | SortOrder
    barangayname?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    cityname?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zipcode?: SortOrderInput | SortOrder
    nationality?: SortOrderInput | SortOrder
    country?: SortOrderInput | SortOrder
    religion?: SortOrderInput | SortOrder
    contactno?: SortOrderInput | SortOrder
    moblie?: SortOrderInput | SortOrder
    faxno?: SortOrderInput | SortOrder
    philhealth?: SortOrderInput | SortOrder
    seniorid?: SortOrderInput | SortOrder
    pwd?: SortOrderInput | SortOrder
    expirydatepwd?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    isactive?: SortOrder
    remarks?: SortOrderInput | SortOrder
    picturelink?: SortOrderInput | SortOrder
    uploadid?: SortOrderInput | SortOrder
    inputdate?: SortOrderInput | SortOrder
    inputby?: SortOrderInput | SortOrder
    updatedate?: SortOrderInput | SortOrder
    updateby?: SortOrderInput | SortOrder
    lastvisit?: SortOrderInput | SortOrder
    passportno?: SortOrderInput | SortOrder
    employeeid?: SortOrderInput | SortOrder
    rdob?: SortOrderInput | SortOrder
    uploaddatetime?: SortOrder
    _count?: PatientCountOrderByAggregateInput
    _avg?: PatientAvgOrderByAggregateInput
    _max?: PatientMaxOrderByAggregateInput
    _min?: PatientMinOrderByAggregateInput
    _sum?: PatientSumOrderByAggregateInput
  }

  export type PatientScalarWhereWithAggregatesInput = {
    AND?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    OR?: PatientScalarWhereWithAggregatesInput[]
    NOT?: PatientScalarWhereWithAggregatesInput | PatientScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"Patient"> | bigint | number
    code?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    fullname?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    lastname?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    firstname?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    middlename?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    suffix?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    prefix?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    gender?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    dob?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
    email?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    fulladdress?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    address?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    barangay?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    barangayname?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    city?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    cityname?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    state?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    zipcode?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    nationality?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    country?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    religion?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    contactno?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    moblie?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    faxno?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    philhealth?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    seniorid?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    pwd?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    expirydatepwd?: DateTimeNullableWithAggregatesFilter<"Patient"> | Date | string | null
    status?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    isactive?: IntWithAggregatesFilter<"Patient"> | number
    remarks?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    picturelink?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    uploadid?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    inputdate?: DateTimeNullableWithAggregatesFilter<"Patient"> | Date | string | null
    inputby?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    updatedate?: DateTimeNullableWithAggregatesFilter<"Patient"> | Date | string | null
    updateby?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    lastvisit?: DateTimeNullableWithAggregatesFilter<"Patient"> | Date | string | null
    passportno?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    employeeid?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    rdob?: StringNullableWithAggregatesFilter<"Patient"> | string | null
    uploaddatetime?: DateTimeWithAggregatesFilter<"Patient"> | Date | string
  }

  export type CardEnrollmentWhereInput = {
    AND?: CardEnrollmentWhereInput | CardEnrollmentWhereInput[]
    OR?: CardEnrollmentWhereInput[]
    NOT?: CardEnrollmentWhereInput | CardEnrollmentWhereInput[]
    id?: IntFilter<"CardEnrollment"> | number
    cardnumber?: StringNullableFilter<"CardEnrollment"> | string | null
    dateenrolled?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    receivedby?: StringNullableFilter<"CardEnrollment"> | string | null
    receiveddate?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    releaseto?: StringNullableFilter<"CardEnrollment"> | string | null
    oldreleaseto?: StringNullableFilter<"CardEnrollment"> | string | null
    releaseby?: StringNullableFilter<"CardEnrollment"> | string | null
    daterelease?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    transferto?: StringNullableFilter<"CardEnrollment"> | string | null
    datetransfer?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    transferby?: StringNullableFilter<"CardEnrollment"> | string | null
    status?: IntNullableFilter<"CardEnrollment"> | number | null
  }

  export type CardEnrollmentOrderByWithRelationInput = {
    id?: SortOrder
    cardnumber?: SortOrderInput | SortOrder
    dateenrolled?: SortOrderInput | SortOrder
    receivedby?: SortOrderInput | SortOrder
    receiveddate?: SortOrderInput | SortOrder
    releaseto?: SortOrderInput | SortOrder
    oldreleaseto?: SortOrderInput | SortOrder
    releaseby?: SortOrderInput | SortOrder
    daterelease?: SortOrderInput | SortOrder
    transferto?: SortOrderInput | SortOrder
    datetransfer?: SortOrderInput | SortOrder
    transferby?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
  }

  export type CardEnrollmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    cardnumber?: string
    AND?: CardEnrollmentWhereInput | CardEnrollmentWhereInput[]
    OR?: CardEnrollmentWhereInput[]
    NOT?: CardEnrollmentWhereInput | CardEnrollmentWhereInput[]
    dateenrolled?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    receivedby?: StringNullableFilter<"CardEnrollment"> | string | null
    receiveddate?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    releaseto?: StringNullableFilter<"CardEnrollment"> | string | null
    oldreleaseto?: StringNullableFilter<"CardEnrollment"> | string | null
    releaseby?: StringNullableFilter<"CardEnrollment"> | string | null
    daterelease?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    transferto?: StringNullableFilter<"CardEnrollment"> | string | null
    datetransfer?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    transferby?: StringNullableFilter<"CardEnrollment"> | string | null
    status?: IntNullableFilter<"CardEnrollment"> | number | null
  }, "id" | "cardnumber">

  export type CardEnrollmentOrderByWithAggregationInput = {
    id?: SortOrder
    cardnumber?: SortOrderInput | SortOrder
    dateenrolled?: SortOrderInput | SortOrder
    receivedby?: SortOrderInput | SortOrder
    receiveddate?: SortOrderInput | SortOrder
    releaseto?: SortOrderInput | SortOrder
    oldreleaseto?: SortOrderInput | SortOrder
    releaseby?: SortOrderInput | SortOrder
    daterelease?: SortOrderInput | SortOrder
    transferto?: SortOrderInput | SortOrder
    datetransfer?: SortOrderInput | SortOrder
    transferby?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    _count?: CardEnrollmentCountOrderByAggregateInput
    _avg?: CardEnrollmentAvgOrderByAggregateInput
    _max?: CardEnrollmentMaxOrderByAggregateInput
    _min?: CardEnrollmentMinOrderByAggregateInput
    _sum?: CardEnrollmentSumOrderByAggregateInput
  }

  export type CardEnrollmentScalarWhereWithAggregatesInput = {
    AND?: CardEnrollmentScalarWhereWithAggregatesInput | CardEnrollmentScalarWhereWithAggregatesInput[]
    OR?: CardEnrollmentScalarWhereWithAggregatesInput[]
    NOT?: CardEnrollmentScalarWhereWithAggregatesInput | CardEnrollmentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CardEnrollment"> | number
    cardnumber?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    dateenrolled?: DateTimeNullableWithAggregatesFilter<"CardEnrollment"> | Date | string | null
    receivedby?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    receiveddate?: DateTimeNullableWithAggregatesFilter<"CardEnrollment"> | Date | string | null
    releaseto?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    oldreleaseto?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    releaseby?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    daterelease?: DateTimeNullableWithAggregatesFilter<"CardEnrollment"> | Date | string | null
    transferto?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    datetransfer?: DateTimeNullableWithAggregatesFilter<"CardEnrollment"> | Date | string | null
    transferby?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    status?: IntNullableWithAggregatesFilter<"CardEnrollment"> | number | null
  }

  export type CardNumberWhereInput = {
    AND?: CardNumberWhereInput | CardNumberWhereInput[]
    OR?: CardNumberWhereInput[]
    NOT?: CardNumberWhereInput | CardNumberWhereInput[]
    id?: IntFilter<"CardNumber"> | number
    year?: IntNullableFilter<"CardNumber"> | number | null
    batch?: IntNullableFilter<"CardNumber"> | number | null
    month?: IntNullableFilter<"CardNumber"> | number | null
    seriesnum?: IntNullableFilter<"CardNumber"> | number | null
    maskedseries?: StringNullableFilter<"CardNumber"> | string | null
    generatedcardnumber?: StringFilter<"CardNumber"> | string
    codecompany?: StringNullableFilter<"CardNumber"> | string | null
    generatedby?: StringNullableFilter<"CardNumber"> | string | null
  }

  export type CardNumberOrderByWithRelationInput = {
    id?: SortOrder
    year?: SortOrderInput | SortOrder
    batch?: SortOrderInput | SortOrder
    month?: SortOrderInput | SortOrder
    seriesnum?: SortOrderInput | SortOrder
    maskedseries?: SortOrderInput | SortOrder
    generatedcardnumber?: SortOrder
    codecompany?: SortOrderInput | SortOrder
    generatedby?: SortOrderInput | SortOrder
  }

  export type CardNumberWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    generatedcardnumber?: string
    AND?: CardNumberWhereInput | CardNumberWhereInput[]
    OR?: CardNumberWhereInput[]
    NOT?: CardNumberWhereInput | CardNumberWhereInput[]
    year?: IntNullableFilter<"CardNumber"> | number | null
    batch?: IntNullableFilter<"CardNumber"> | number | null
    month?: IntNullableFilter<"CardNumber"> | number | null
    seriesnum?: IntNullableFilter<"CardNumber"> | number | null
    maskedseries?: StringNullableFilter<"CardNumber"> | string | null
    codecompany?: StringNullableFilter<"CardNumber"> | string | null
    generatedby?: StringNullableFilter<"CardNumber"> | string | null
  }, "id" | "generatedcardnumber">

  export type CardNumberOrderByWithAggregationInput = {
    id?: SortOrder
    year?: SortOrderInput | SortOrder
    batch?: SortOrderInput | SortOrder
    month?: SortOrderInput | SortOrder
    seriesnum?: SortOrderInput | SortOrder
    maskedseries?: SortOrderInput | SortOrder
    generatedcardnumber?: SortOrder
    codecompany?: SortOrderInput | SortOrder
    generatedby?: SortOrderInput | SortOrder
    _count?: CardNumberCountOrderByAggregateInput
    _avg?: CardNumberAvgOrderByAggregateInput
    _max?: CardNumberMaxOrderByAggregateInput
    _min?: CardNumberMinOrderByAggregateInput
    _sum?: CardNumberSumOrderByAggregateInput
  }

  export type CardNumberScalarWhereWithAggregatesInput = {
    AND?: CardNumberScalarWhereWithAggregatesInput | CardNumberScalarWhereWithAggregatesInput[]
    OR?: CardNumberScalarWhereWithAggregatesInput[]
    NOT?: CardNumberScalarWhereWithAggregatesInput | CardNumberScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CardNumber"> | number
    year?: IntNullableWithAggregatesFilter<"CardNumber"> | number | null
    batch?: IntNullableWithAggregatesFilter<"CardNumber"> | number | null
    month?: IntNullableWithAggregatesFilter<"CardNumber"> | number | null
    seriesnum?: IntNullableWithAggregatesFilter<"CardNumber"> | number | null
    maskedseries?: StringNullableWithAggregatesFilter<"CardNumber"> | string | null
    generatedcardnumber?: StringWithAggregatesFilter<"CardNumber"> | string
    codecompany?: StringNullableWithAggregatesFilter<"CardNumber"> | string | null
    generatedby?: StringNullableWithAggregatesFilter<"CardNumber"> | string | null
  }

  export type CardVerifiedWhereInput = {
    AND?: CardVerifiedWhereInput | CardVerifiedWhereInput[]
    OR?: CardVerifiedWhereInput[]
    NOT?: CardVerifiedWhereInput | CardVerifiedWhereInput[]
    id?: IntFilter<"CardVerified"> | number
    verifiedcardnumbers?: StringFilter<"CardVerified"> | string
    ictreceived?: StringNullableFilter<"CardVerified"> | string | null
    datereceived?: DateTimeNullableFilter<"CardVerified"> | Date | string | null
  }

  export type CardVerifiedOrderByWithRelationInput = {
    id?: SortOrder
    verifiedcardnumbers?: SortOrder
    ictreceived?: SortOrderInput | SortOrder
    datereceived?: SortOrderInput | SortOrder
  }

  export type CardVerifiedWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    verifiedcardnumbers?: string
    AND?: CardVerifiedWhereInput | CardVerifiedWhereInput[]
    OR?: CardVerifiedWhereInput[]
    NOT?: CardVerifiedWhereInput | CardVerifiedWhereInput[]
    ictreceived?: StringNullableFilter<"CardVerified"> | string | null
    datereceived?: DateTimeNullableFilter<"CardVerified"> | Date | string | null
  }, "id" | "verifiedcardnumbers">

  export type CardVerifiedOrderByWithAggregationInput = {
    id?: SortOrder
    verifiedcardnumbers?: SortOrder
    ictreceived?: SortOrderInput | SortOrder
    datereceived?: SortOrderInput | SortOrder
    _count?: CardVerifiedCountOrderByAggregateInput
    _avg?: CardVerifiedAvgOrderByAggregateInput
    _max?: CardVerifiedMaxOrderByAggregateInput
    _min?: CardVerifiedMinOrderByAggregateInput
    _sum?: CardVerifiedSumOrderByAggregateInput
  }

  export type CardVerifiedScalarWhereWithAggregatesInput = {
    AND?: CardVerifiedScalarWhereWithAggregatesInput | CardVerifiedScalarWhereWithAggregatesInput[]
    OR?: CardVerifiedScalarWhereWithAggregatesInput[]
    NOT?: CardVerifiedScalarWhereWithAggregatesInput | CardVerifiedScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CardVerified"> | number
    verifiedcardnumbers?: StringWithAggregatesFilter<"CardVerified"> | string
    ictreceived?: StringNullableWithAggregatesFilter<"CardVerified"> | string | null
    datereceived?: DateTimeNullableWithAggregatesFilter<"CardVerified"> | Date | string | null
  }

  export type CmsCompanyWhereInput = {
    AND?: CmsCompanyWhereInput | CmsCompanyWhereInput[]
    OR?: CmsCompanyWhereInput[]
    NOT?: CmsCompanyWhereInput | CmsCompanyWhereInput[]
    id?: IntFilter<"CmsCompany"> | number
    server?: StringNullableFilter<"CmsCompany"> | string | null
    idcompany?: BigIntNullableFilter<"CmsCompany"> | bigint | number | null
    code?: StringNullableFilter<"CmsCompany"> | string | null
    name?: StringNullableFilter<"CmsCompany"> | string | null
    status?: StringNullableFilter<"CmsCompany"> | string | null
    billingtype?: StringNullableFilter<"CmsCompany"> | string | null
  }

  export type CmsCompanyOrderByWithRelationInput = {
    id?: SortOrder
    server?: SortOrderInput | SortOrder
    idcompany?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    billingtype?: SortOrderInput | SortOrder
  }

  export type CmsCompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: CmsCompanyWhereInput | CmsCompanyWhereInput[]
    OR?: CmsCompanyWhereInput[]
    NOT?: CmsCompanyWhereInput | CmsCompanyWhereInput[]
    server?: StringNullableFilter<"CmsCompany"> | string | null
    idcompany?: BigIntNullableFilter<"CmsCompany"> | bigint | number | null
    code?: StringNullableFilter<"CmsCompany"> | string | null
    name?: StringNullableFilter<"CmsCompany"> | string | null
    status?: StringNullableFilter<"CmsCompany"> | string | null
    billingtype?: StringNullableFilter<"CmsCompany"> | string | null
  }, "id">

  export type CmsCompanyOrderByWithAggregationInput = {
    id?: SortOrder
    server?: SortOrderInput | SortOrder
    idcompany?: SortOrderInput | SortOrder
    code?: SortOrderInput | SortOrder
    name?: SortOrderInput | SortOrder
    status?: SortOrderInput | SortOrder
    billingtype?: SortOrderInput | SortOrder
    _count?: CmsCompanyCountOrderByAggregateInput
    _avg?: CmsCompanyAvgOrderByAggregateInput
    _max?: CmsCompanyMaxOrderByAggregateInput
    _min?: CmsCompanyMinOrderByAggregateInput
    _sum?: CmsCompanySumOrderByAggregateInput
  }

  export type CmsCompanyScalarWhereWithAggregatesInput = {
    AND?: CmsCompanyScalarWhereWithAggregatesInput | CmsCompanyScalarWhereWithAggregatesInput[]
    OR?: CmsCompanyScalarWhereWithAggregatesInput[]
    NOT?: CmsCompanyScalarWhereWithAggregatesInput | CmsCompanyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"CmsCompany"> | number
    server?: StringNullableWithAggregatesFilter<"CmsCompany"> | string | null
    idcompany?: BigIntNullableWithAggregatesFilter<"CmsCompany"> | bigint | number | null
    code?: StringNullableWithAggregatesFilter<"CmsCompany"> | string | null
    name?: StringNullableWithAggregatesFilter<"CmsCompany"> | string | null
    status?: StringNullableWithAggregatesFilter<"CmsCompany"> | string | null
    billingtype?: StringNullableWithAggregatesFilter<"CmsCompany"> | string | null
  }

  export type ConsultationNoteWhereInput = {
    AND?: ConsultationNoteWhereInput | ConsultationNoteWhereInput[]
    OR?: ConsultationNoteWhereInput[]
    NOT?: ConsultationNoteWhereInput | ConsultationNoteWhereInput[]
    id?: IntFilter<"ConsultationNote"> | number
    queue_id?: IntFilter<"ConsultationNote"> | number
    patient_id?: StringFilter<"ConsultationNote"> | string
    status?: StringFilter<"ConsultationNote"> | string
    is_draft?: IntFilter<"ConsultationNote"> | number
    chief_complaint?: StringNullableFilter<"ConsultationNote"> | string | null
    history_illness?: StringNullableFilter<"ConsultationNote"> | string | null
    past_history?: StringNullableFilter<"ConsultationNote"> | string | null
    family_history?: StringNullableFilter<"ConsultationNote"> | string | null
    pe_findings?: StringNullableFilter<"ConsultationNote"> | string | null
    diagnosis?: StringNullableFilter<"ConsultationNote"> | string | null
    icd_code?: StringNullableFilter<"ConsultationNote"> | string | null
    treatment_plan?: StringNullableFilter<"ConsultationNote"> | string | null
    orders?: StringNullableFilter<"ConsultationNote"> | string | null
    pcp_doctor?: StringNullableFilter<"ConsultationNote"> | string | null
    doctor_id?: IntNullableFilter<"ConsultationNote"> | number | null
    doctor_name?: StringNullableFilter<"ConsultationNote"> | string | null
    recorded_by?: IntNullableFilter<"ConsultationNote"> | number | null
    completed_at?: DateTimeNullableFilter<"ConsultationNote"> | Date | string | null
    created_at?: DateTimeFilter<"ConsultationNote"> | Date | string
    updated_at?: DateTimeFilter<"ConsultationNote"> | Date | string
  }

  export type ConsultationNoteOrderByWithRelationInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    status?: SortOrder
    is_draft?: SortOrder
    chief_complaint?: SortOrderInput | SortOrder
    history_illness?: SortOrderInput | SortOrder
    past_history?: SortOrderInput | SortOrder
    family_history?: SortOrderInput | SortOrder
    pe_findings?: SortOrderInput | SortOrder
    diagnosis?: SortOrderInput | SortOrder
    icd_code?: SortOrderInput | SortOrder
    treatment_plan?: SortOrderInput | SortOrder
    orders?: SortOrderInput | SortOrder
    pcp_doctor?: SortOrderInput | SortOrder
    doctor_id?: SortOrderInput | SortOrder
    doctor_name?: SortOrderInput | SortOrder
    recorded_by?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ConsultationNoteWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    queue_id?: number
    AND?: ConsultationNoteWhereInput | ConsultationNoteWhereInput[]
    OR?: ConsultationNoteWhereInput[]
    NOT?: ConsultationNoteWhereInput | ConsultationNoteWhereInput[]
    patient_id?: StringFilter<"ConsultationNote"> | string
    status?: StringFilter<"ConsultationNote"> | string
    is_draft?: IntFilter<"ConsultationNote"> | number
    chief_complaint?: StringNullableFilter<"ConsultationNote"> | string | null
    history_illness?: StringNullableFilter<"ConsultationNote"> | string | null
    past_history?: StringNullableFilter<"ConsultationNote"> | string | null
    family_history?: StringNullableFilter<"ConsultationNote"> | string | null
    pe_findings?: StringNullableFilter<"ConsultationNote"> | string | null
    diagnosis?: StringNullableFilter<"ConsultationNote"> | string | null
    icd_code?: StringNullableFilter<"ConsultationNote"> | string | null
    treatment_plan?: StringNullableFilter<"ConsultationNote"> | string | null
    orders?: StringNullableFilter<"ConsultationNote"> | string | null
    pcp_doctor?: StringNullableFilter<"ConsultationNote"> | string | null
    doctor_id?: IntNullableFilter<"ConsultationNote"> | number | null
    doctor_name?: StringNullableFilter<"ConsultationNote"> | string | null
    recorded_by?: IntNullableFilter<"ConsultationNote"> | number | null
    completed_at?: DateTimeNullableFilter<"ConsultationNote"> | Date | string | null
    created_at?: DateTimeFilter<"ConsultationNote"> | Date | string
    updated_at?: DateTimeFilter<"ConsultationNote"> | Date | string
  }, "id" | "queue_id">

  export type ConsultationNoteOrderByWithAggregationInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    status?: SortOrder
    is_draft?: SortOrder
    chief_complaint?: SortOrderInput | SortOrder
    history_illness?: SortOrderInput | SortOrder
    past_history?: SortOrderInput | SortOrder
    family_history?: SortOrderInput | SortOrder
    pe_findings?: SortOrderInput | SortOrder
    diagnosis?: SortOrderInput | SortOrder
    icd_code?: SortOrderInput | SortOrder
    treatment_plan?: SortOrderInput | SortOrder
    orders?: SortOrderInput | SortOrder
    pcp_doctor?: SortOrderInput | SortOrder
    doctor_id?: SortOrderInput | SortOrder
    doctor_name?: SortOrderInput | SortOrder
    recorded_by?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ConsultationNoteCountOrderByAggregateInput
    _avg?: ConsultationNoteAvgOrderByAggregateInput
    _max?: ConsultationNoteMaxOrderByAggregateInput
    _min?: ConsultationNoteMinOrderByAggregateInput
    _sum?: ConsultationNoteSumOrderByAggregateInput
  }

  export type ConsultationNoteScalarWhereWithAggregatesInput = {
    AND?: ConsultationNoteScalarWhereWithAggregatesInput | ConsultationNoteScalarWhereWithAggregatesInput[]
    OR?: ConsultationNoteScalarWhereWithAggregatesInput[]
    NOT?: ConsultationNoteScalarWhereWithAggregatesInput | ConsultationNoteScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ConsultationNote"> | number
    queue_id?: IntWithAggregatesFilter<"ConsultationNote"> | number
    patient_id?: StringWithAggregatesFilter<"ConsultationNote"> | string
    status?: StringWithAggregatesFilter<"ConsultationNote"> | string
    is_draft?: IntWithAggregatesFilter<"ConsultationNote"> | number
    chief_complaint?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    history_illness?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    past_history?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    family_history?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    pe_findings?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    diagnosis?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    icd_code?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    treatment_plan?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    orders?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    pcp_doctor?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    doctor_id?: IntNullableWithAggregatesFilter<"ConsultationNote"> | number | null
    doctor_name?: StringNullableWithAggregatesFilter<"ConsultationNote"> | string | null
    recorded_by?: IntNullableWithAggregatesFilter<"ConsultationNote"> | number | null
    completed_at?: DateTimeNullableWithAggregatesFilter<"ConsultationNote"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"ConsultationNote"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ConsultationNote"> | Date | string
  }

  export type VitalsWhereInput = {
    AND?: VitalsWhereInput | VitalsWhereInput[]
    OR?: VitalsWhereInput[]
    NOT?: VitalsWhereInput | VitalsWhereInput[]
    id?: IntFilter<"Vitals"> | number
    queue_id?: IntFilter<"Vitals"> | number
    patient_id?: StringNullableFilter<"Vitals"> | string | null
    bp_systolic?: IntNullableFilter<"Vitals"> | number | null
    bp_diastolic?: IntNullableFilter<"Vitals"> | number | null
    bp_systolic2?: IntNullableFilter<"Vitals"> | number | null
    bp_diastolic2?: IntNullableFilter<"Vitals"> | number | null
    bp_systolic3?: IntNullableFilter<"Vitals"> | number | null
    bp_diastolic3?: IntNullableFilter<"Vitals"> | number | null
    heart_rate?: IntNullableFilter<"Vitals"> | number | null
    temperature?: FloatNullableFilter<"Vitals"> | number | null
    respiratory_rate?: IntNullableFilter<"Vitals"> | number | null
    o2_saturation?: FloatNullableFilter<"Vitals"> | number | null
    weight_kg?: FloatNullableFilter<"Vitals"> | number | null
    height_cm?: FloatNullableFilter<"Vitals"> | number | null
    bmi?: FloatNullableFilter<"Vitals"> | number | null
    vision_right_od?: StringNullableFilter<"Vitals"> | string | null
    vision_left_os?: StringNullableFilter<"Vitals"> | string | null
    vision_corrected?: StringNullableFilter<"Vitals"> | string | null
    color_vision?: StringNullableFilter<"Vitals"> | string | null
    chief_complaint?: StringNullableFilter<"Vitals"> | string | null
    pcp_doctor?: StringNullableFilter<"Vitals"> | string | null
    recorded_by?: IntNullableFilter<"Vitals"> | number | null
    created_at?: DateTimeFilter<"Vitals"> | Date | string
    updated_at?: DateTimeFilter<"Vitals"> | Date | string
  }

  export type VitalsOrderByWithRelationInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrderInput | SortOrder
    bp_systolic?: SortOrderInput | SortOrder
    bp_diastolic?: SortOrderInput | SortOrder
    bp_systolic2?: SortOrderInput | SortOrder
    bp_diastolic2?: SortOrderInput | SortOrder
    bp_systolic3?: SortOrderInput | SortOrder
    bp_diastolic3?: SortOrderInput | SortOrder
    heart_rate?: SortOrderInput | SortOrder
    temperature?: SortOrderInput | SortOrder
    respiratory_rate?: SortOrderInput | SortOrder
    o2_saturation?: SortOrderInput | SortOrder
    weight_kg?: SortOrderInput | SortOrder
    height_cm?: SortOrderInput | SortOrder
    bmi?: SortOrderInput | SortOrder
    vision_right_od?: SortOrderInput | SortOrder
    vision_left_os?: SortOrderInput | SortOrder
    vision_corrected?: SortOrderInput | SortOrder
    color_vision?: SortOrderInput | SortOrder
    chief_complaint?: SortOrderInput | SortOrder
    pcp_doctor?: SortOrderInput | SortOrder
    recorded_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type VitalsWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    queue_id?: number
    AND?: VitalsWhereInput | VitalsWhereInput[]
    OR?: VitalsWhereInput[]
    NOT?: VitalsWhereInput | VitalsWhereInput[]
    patient_id?: StringNullableFilter<"Vitals"> | string | null
    bp_systolic?: IntNullableFilter<"Vitals"> | number | null
    bp_diastolic?: IntNullableFilter<"Vitals"> | number | null
    bp_systolic2?: IntNullableFilter<"Vitals"> | number | null
    bp_diastolic2?: IntNullableFilter<"Vitals"> | number | null
    bp_systolic3?: IntNullableFilter<"Vitals"> | number | null
    bp_diastolic3?: IntNullableFilter<"Vitals"> | number | null
    heart_rate?: IntNullableFilter<"Vitals"> | number | null
    temperature?: FloatNullableFilter<"Vitals"> | number | null
    respiratory_rate?: IntNullableFilter<"Vitals"> | number | null
    o2_saturation?: FloatNullableFilter<"Vitals"> | number | null
    weight_kg?: FloatNullableFilter<"Vitals"> | number | null
    height_cm?: FloatNullableFilter<"Vitals"> | number | null
    bmi?: FloatNullableFilter<"Vitals"> | number | null
    vision_right_od?: StringNullableFilter<"Vitals"> | string | null
    vision_left_os?: StringNullableFilter<"Vitals"> | string | null
    vision_corrected?: StringNullableFilter<"Vitals"> | string | null
    color_vision?: StringNullableFilter<"Vitals"> | string | null
    chief_complaint?: StringNullableFilter<"Vitals"> | string | null
    pcp_doctor?: StringNullableFilter<"Vitals"> | string | null
    recorded_by?: IntNullableFilter<"Vitals"> | number | null
    created_at?: DateTimeFilter<"Vitals"> | Date | string
    updated_at?: DateTimeFilter<"Vitals"> | Date | string
  }, "id" | "queue_id">

  export type VitalsOrderByWithAggregationInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrderInput | SortOrder
    bp_systolic?: SortOrderInput | SortOrder
    bp_diastolic?: SortOrderInput | SortOrder
    bp_systolic2?: SortOrderInput | SortOrder
    bp_diastolic2?: SortOrderInput | SortOrder
    bp_systolic3?: SortOrderInput | SortOrder
    bp_diastolic3?: SortOrderInput | SortOrder
    heart_rate?: SortOrderInput | SortOrder
    temperature?: SortOrderInput | SortOrder
    respiratory_rate?: SortOrderInput | SortOrder
    o2_saturation?: SortOrderInput | SortOrder
    weight_kg?: SortOrderInput | SortOrder
    height_cm?: SortOrderInput | SortOrder
    bmi?: SortOrderInput | SortOrder
    vision_right_od?: SortOrderInput | SortOrder
    vision_left_os?: SortOrderInput | SortOrder
    vision_corrected?: SortOrderInput | SortOrder
    color_vision?: SortOrderInput | SortOrder
    chief_complaint?: SortOrderInput | SortOrder
    pcp_doctor?: SortOrderInput | SortOrder
    recorded_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: VitalsCountOrderByAggregateInput
    _avg?: VitalsAvgOrderByAggregateInput
    _max?: VitalsMaxOrderByAggregateInput
    _min?: VitalsMinOrderByAggregateInput
    _sum?: VitalsSumOrderByAggregateInput
  }

  export type VitalsScalarWhereWithAggregatesInput = {
    AND?: VitalsScalarWhereWithAggregatesInput | VitalsScalarWhereWithAggregatesInput[]
    OR?: VitalsScalarWhereWithAggregatesInput[]
    NOT?: VitalsScalarWhereWithAggregatesInput | VitalsScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Vitals"> | number
    queue_id?: IntWithAggregatesFilter<"Vitals"> | number
    patient_id?: StringNullableWithAggregatesFilter<"Vitals"> | string | null
    bp_systolic?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    bp_diastolic?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    bp_systolic2?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    bp_diastolic2?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    bp_systolic3?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    bp_diastolic3?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    heart_rate?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    temperature?: FloatNullableWithAggregatesFilter<"Vitals"> | number | null
    respiratory_rate?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    o2_saturation?: FloatNullableWithAggregatesFilter<"Vitals"> | number | null
    weight_kg?: FloatNullableWithAggregatesFilter<"Vitals"> | number | null
    height_cm?: FloatNullableWithAggregatesFilter<"Vitals"> | number | null
    bmi?: FloatNullableWithAggregatesFilter<"Vitals"> | number | null
    vision_right_od?: StringNullableWithAggregatesFilter<"Vitals"> | string | null
    vision_left_os?: StringNullableWithAggregatesFilter<"Vitals"> | string | null
    vision_corrected?: StringNullableWithAggregatesFilter<"Vitals"> | string | null
    color_vision?: StringNullableWithAggregatesFilter<"Vitals"> | string | null
    chief_complaint?: StringNullableWithAggregatesFilter<"Vitals"> | string | null
    pcp_doctor?: StringNullableWithAggregatesFilter<"Vitals"> | string | null
    recorded_by?: IntNullableWithAggregatesFilter<"Vitals"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"Vitals"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Vitals"> | Date | string
  }

  export type PhysicalExaminationWhereInput = {
    AND?: PhysicalExaminationWhereInput | PhysicalExaminationWhereInput[]
    OR?: PhysicalExaminationWhereInput[]
    NOT?: PhysicalExaminationWhereInput | PhysicalExaminationWhereInput[]
    id?: IntFilter<"PhysicalExamination"> | number
    queue_id?: IntFilter<"PhysicalExamination"> | number
    patient_id?: StringNullableFilter<"PhysicalExamination"> | string | null
    hypertension?: BoolFilter<"PhysicalExamination"> | boolean
    diabetes?: BoolFilter<"PhysicalExamination"> | boolean
    asthma?: BoolFilter<"PhysicalExamination"> | boolean
    heart_disease?: BoolFilter<"PhysicalExamination"> | boolean
    thyroid_disease?: BoolFilter<"PhysicalExamination"> | boolean
    kidney_disease?: BoolFilter<"PhysicalExamination"> | boolean
    allergies?: BoolFilter<"PhysicalExamination"> | boolean
    allergies_specify?: StringNullableFilter<"PhysicalExamination"> | string | null
    surgery_history?: BoolFilter<"PhysicalExamination"> | boolean
    surgery_specify?: StringNullableFilter<"PhysicalExamination"> | string | null
    smoker?: BoolFilter<"PhysicalExamination"> | boolean
    pack_years?: FloatNullableFilter<"PhysicalExamination"> | number | null
    alcoholic?: BoolFilter<"PhysicalExamination"> | boolean
    lmp?: DateTimeNullableFilter<"PhysicalExamination"> | Date | string | null
    gravida?: IntNullableFilter<"PhysicalExamination"> | number | null
    para?: IntNullableFilter<"PhysicalExamination"> | number | null
    family_hypertension?: BoolFilter<"PhysicalExamination"> | boolean
    family_diabetes?: BoolFilter<"PhysicalExamination"> | boolean
    family_cancer?: BoolFilter<"PhysicalExamination"> | boolean
    skin?: StringNullableFilter<"PhysicalExamination"> | string | null
    heent?: StringNullableFilter<"PhysicalExamination"> | string | null
    neck?: StringNullableFilter<"PhysicalExamination"> | string | null
    chest_lungs?: StringNullableFilter<"PhysicalExamination"> | string | null
    heart?: StringNullableFilter<"PhysicalExamination"> | string | null
    abdomen?: StringNullableFilter<"PhysicalExamination"> | string | null
    extremities?: StringNullableFilter<"PhysicalExamination"> | string | null
    neurological?: StringNullableFilter<"PhysicalExamination"> | string | null
    fitness_class?: StringNullableFilter<"PhysicalExamination"> | string | null
    recorded_by?: IntNullableFilter<"PhysicalExamination"> | number | null
    created_at?: DateTimeFilter<"PhysicalExamination"> | Date | string
    updated_at?: DateTimeFilter<"PhysicalExamination"> | Date | string
  }

  export type PhysicalExaminationOrderByWithRelationInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrderInput | SortOrder
    hypertension?: SortOrder
    diabetes?: SortOrder
    asthma?: SortOrder
    heart_disease?: SortOrder
    thyroid_disease?: SortOrder
    kidney_disease?: SortOrder
    allergies?: SortOrder
    allergies_specify?: SortOrderInput | SortOrder
    surgery_history?: SortOrder
    surgery_specify?: SortOrderInput | SortOrder
    smoker?: SortOrder
    pack_years?: SortOrderInput | SortOrder
    alcoholic?: SortOrder
    lmp?: SortOrderInput | SortOrder
    gravida?: SortOrderInput | SortOrder
    para?: SortOrderInput | SortOrder
    family_hypertension?: SortOrder
    family_diabetes?: SortOrder
    family_cancer?: SortOrder
    skin?: SortOrderInput | SortOrder
    heent?: SortOrderInput | SortOrder
    neck?: SortOrderInput | SortOrder
    chest_lungs?: SortOrderInput | SortOrder
    heart?: SortOrderInput | SortOrder
    abdomen?: SortOrderInput | SortOrder
    extremities?: SortOrderInput | SortOrder
    neurological?: SortOrderInput | SortOrder
    fitness_class?: SortOrderInput | SortOrder
    recorded_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PhysicalExaminationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    queue_id?: number
    AND?: PhysicalExaminationWhereInput | PhysicalExaminationWhereInput[]
    OR?: PhysicalExaminationWhereInput[]
    NOT?: PhysicalExaminationWhereInput | PhysicalExaminationWhereInput[]
    patient_id?: StringNullableFilter<"PhysicalExamination"> | string | null
    hypertension?: BoolFilter<"PhysicalExamination"> | boolean
    diabetes?: BoolFilter<"PhysicalExamination"> | boolean
    asthma?: BoolFilter<"PhysicalExamination"> | boolean
    heart_disease?: BoolFilter<"PhysicalExamination"> | boolean
    thyroid_disease?: BoolFilter<"PhysicalExamination"> | boolean
    kidney_disease?: BoolFilter<"PhysicalExamination"> | boolean
    allergies?: BoolFilter<"PhysicalExamination"> | boolean
    allergies_specify?: StringNullableFilter<"PhysicalExamination"> | string | null
    surgery_history?: BoolFilter<"PhysicalExamination"> | boolean
    surgery_specify?: StringNullableFilter<"PhysicalExamination"> | string | null
    smoker?: BoolFilter<"PhysicalExamination"> | boolean
    pack_years?: FloatNullableFilter<"PhysicalExamination"> | number | null
    alcoholic?: BoolFilter<"PhysicalExamination"> | boolean
    lmp?: DateTimeNullableFilter<"PhysicalExamination"> | Date | string | null
    gravida?: IntNullableFilter<"PhysicalExamination"> | number | null
    para?: IntNullableFilter<"PhysicalExamination"> | number | null
    family_hypertension?: BoolFilter<"PhysicalExamination"> | boolean
    family_diabetes?: BoolFilter<"PhysicalExamination"> | boolean
    family_cancer?: BoolFilter<"PhysicalExamination"> | boolean
    skin?: StringNullableFilter<"PhysicalExamination"> | string | null
    heent?: StringNullableFilter<"PhysicalExamination"> | string | null
    neck?: StringNullableFilter<"PhysicalExamination"> | string | null
    chest_lungs?: StringNullableFilter<"PhysicalExamination"> | string | null
    heart?: StringNullableFilter<"PhysicalExamination"> | string | null
    abdomen?: StringNullableFilter<"PhysicalExamination"> | string | null
    extremities?: StringNullableFilter<"PhysicalExamination"> | string | null
    neurological?: StringNullableFilter<"PhysicalExamination"> | string | null
    fitness_class?: StringNullableFilter<"PhysicalExamination"> | string | null
    recorded_by?: IntNullableFilter<"PhysicalExamination"> | number | null
    created_at?: DateTimeFilter<"PhysicalExamination"> | Date | string
    updated_at?: DateTimeFilter<"PhysicalExamination"> | Date | string
  }, "id" | "queue_id">

  export type PhysicalExaminationOrderByWithAggregationInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrderInput | SortOrder
    hypertension?: SortOrder
    diabetes?: SortOrder
    asthma?: SortOrder
    heart_disease?: SortOrder
    thyroid_disease?: SortOrder
    kidney_disease?: SortOrder
    allergies?: SortOrder
    allergies_specify?: SortOrderInput | SortOrder
    surgery_history?: SortOrder
    surgery_specify?: SortOrderInput | SortOrder
    smoker?: SortOrder
    pack_years?: SortOrderInput | SortOrder
    alcoholic?: SortOrder
    lmp?: SortOrderInput | SortOrder
    gravida?: SortOrderInput | SortOrder
    para?: SortOrderInput | SortOrder
    family_hypertension?: SortOrder
    family_diabetes?: SortOrder
    family_cancer?: SortOrder
    skin?: SortOrderInput | SortOrder
    heent?: SortOrderInput | SortOrder
    neck?: SortOrderInput | SortOrder
    chest_lungs?: SortOrderInput | SortOrder
    heart?: SortOrderInput | SortOrder
    abdomen?: SortOrderInput | SortOrder
    extremities?: SortOrderInput | SortOrder
    neurological?: SortOrderInput | SortOrder
    fitness_class?: SortOrderInput | SortOrder
    recorded_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: PhysicalExaminationCountOrderByAggregateInput
    _avg?: PhysicalExaminationAvgOrderByAggregateInput
    _max?: PhysicalExaminationMaxOrderByAggregateInput
    _min?: PhysicalExaminationMinOrderByAggregateInput
    _sum?: PhysicalExaminationSumOrderByAggregateInput
  }

  export type PhysicalExaminationScalarWhereWithAggregatesInput = {
    AND?: PhysicalExaminationScalarWhereWithAggregatesInput | PhysicalExaminationScalarWhereWithAggregatesInput[]
    OR?: PhysicalExaminationScalarWhereWithAggregatesInput[]
    NOT?: PhysicalExaminationScalarWhereWithAggregatesInput | PhysicalExaminationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PhysicalExamination"> | number
    queue_id?: IntWithAggregatesFilter<"PhysicalExamination"> | number
    patient_id?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    hypertension?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    diabetes?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    asthma?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    heart_disease?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    thyroid_disease?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    kidney_disease?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    allergies?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    allergies_specify?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    surgery_history?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    surgery_specify?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    smoker?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    pack_years?: FloatNullableWithAggregatesFilter<"PhysicalExamination"> | number | null
    alcoholic?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    lmp?: DateTimeNullableWithAggregatesFilter<"PhysicalExamination"> | Date | string | null
    gravida?: IntNullableWithAggregatesFilter<"PhysicalExamination"> | number | null
    para?: IntNullableWithAggregatesFilter<"PhysicalExamination"> | number | null
    family_hypertension?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    family_diabetes?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    family_cancer?: BoolWithAggregatesFilter<"PhysicalExamination"> | boolean
    skin?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    heent?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    neck?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    chest_lungs?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    heart?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    abdomen?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    extremities?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    neurological?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    fitness_class?: StringNullableWithAggregatesFilter<"PhysicalExamination"> | string | null
    recorded_by?: IntNullableWithAggregatesFilter<"PhysicalExamination"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"PhysicalExamination"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"PhysicalExamination"> | Date | string
  }

  export type MedicalEvaluationWhereInput = {
    AND?: MedicalEvaluationWhereInput | MedicalEvaluationWhereInput[]
    OR?: MedicalEvaluationWhereInput[]
    NOT?: MedicalEvaluationWhereInput | MedicalEvaluationWhereInput[]
    id?: IntFilter<"MedicalEvaluation"> | number
    queue_id?: IntFilter<"MedicalEvaluation"> | number
    patient_id?: StringFilter<"MedicalEvaluation"> | string
    item_code?: StringFilter<"MedicalEvaluation"> | string
    item_name?: StringNullableFilter<"MedicalEvaluation"> | string | null
    findings?: StringNullableFilter<"MedicalEvaluation"> | string | null
    assessment?: StringNullableFilter<"MedicalEvaluation"> | string | null
    recommendation?: StringNullableFilter<"MedicalEvaluation"> | string | null
    class_value?: StringNullableFilter<"MedicalEvaluation"> | string | null
    recorded_by?: IntNullableFilter<"MedicalEvaluation"> | number | null
    created_at?: DateTimeFilter<"MedicalEvaluation"> | Date | string
    updated_at?: DateTimeFilter<"MedicalEvaluation"> | Date | string
  }

  export type MedicalEvaluationOrderByWithRelationInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrderInput | SortOrder
    findings?: SortOrderInput | SortOrder
    assessment?: SortOrderInput | SortOrder
    recommendation?: SortOrderInput | SortOrder
    class_value?: SortOrderInput | SortOrder
    recorded_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MedicalEvaluationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    queue_id_item_code?: MedicalEvaluationQueue_idItem_codeCompoundUniqueInput
    AND?: MedicalEvaluationWhereInput | MedicalEvaluationWhereInput[]
    OR?: MedicalEvaluationWhereInput[]
    NOT?: MedicalEvaluationWhereInput | MedicalEvaluationWhereInput[]
    queue_id?: IntFilter<"MedicalEvaluation"> | number
    patient_id?: StringFilter<"MedicalEvaluation"> | string
    item_code?: StringFilter<"MedicalEvaluation"> | string
    item_name?: StringNullableFilter<"MedicalEvaluation"> | string | null
    findings?: StringNullableFilter<"MedicalEvaluation"> | string | null
    assessment?: StringNullableFilter<"MedicalEvaluation"> | string | null
    recommendation?: StringNullableFilter<"MedicalEvaluation"> | string | null
    class_value?: StringNullableFilter<"MedicalEvaluation"> | string | null
    recorded_by?: IntNullableFilter<"MedicalEvaluation"> | number | null
    created_at?: DateTimeFilter<"MedicalEvaluation"> | Date | string
    updated_at?: DateTimeFilter<"MedicalEvaluation"> | Date | string
  }, "id" | "queue_id_item_code">

  export type MedicalEvaluationOrderByWithAggregationInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrderInput | SortOrder
    findings?: SortOrderInput | SortOrder
    assessment?: SortOrderInput | SortOrder
    recommendation?: SortOrderInput | SortOrder
    class_value?: SortOrderInput | SortOrder
    recorded_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: MedicalEvaluationCountOrderByAggregateInput
    _avg?: MedicalEvaluationAvgOrderByAggregateInput
    _max?: MedicalEvaluationMaxOrderByAggregateInput
    _min?: MedicalEvaluationMinOrderByAggregateInput
    _sum?: MedicalEvaluationSumOrderByAggregateInput
  }

  export type MedicalEvaluationScalarWhereWithAggregatesInput = {
    AND?: MedicalEvaluationScalarWhereWithAggregatesInput | MedicalEvaluationScalarWhereWithAggregatesInput[]
    OR?: MedicalEvaluationScalarWhereWithAggregatesInput[]
    NOT?: MedicalEvaluationScalarWhereWithAggregatesInput | MedicalEvaluationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"MedicalEvaluation"> | number
    queue_id?: IntWithAggregatesFilter<"MedicalEvaluation"> | number
    patient_id?: StringWithAggregatesFilter<"MedicalEvaluation"> | string
    item_code?: StringWithAggregatesFilter<"MedicalEvaluation"> | string
    item_name?: StringNullableWithAggregatesFilter<"MedicalEvaluation"> | string | null
    findings?: StringNullableWithAggregatesFilter<"MedicalEvaluation"> | string | null
    assessment?: StringNullableWithAggregatesFilter<"MedicalEvaluation"> | string | null
    recommendation?: StringNullableWithAggregatesFilter<"MedicalEvaluation"> | string | null
    class_value?: StringNullableWithAggregatesFilter<"MedicalEvaluation"> | string | null
    recorded_by?: IntNullableWithAggregatesFilter<"MedicalEvaluation"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"MedicalEvaluation"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"MedicalEvaluation"> | Date | string
  }

  export type UserCreateInput = {
    email?: string | null
    password?: string | null
    permissions?: string | null
    activated?: boolean
    created_by?: number | null
    activation_code?: string | null
    activated_at?: Date | string | null
    last_login?: Date | string | null
    persist_code?: string | null
    reset_password_code?: string | null
    first_name?: string | null
    last_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    deleted_at?: Date | string | null
    website?: string | null
    country?: string | null
    gravatar?: string | null
    location_id?: number | null
    phone?: string | null
    jobtitle?: string | null
    manager_id?: number | null
    employee_num?: string | null
    avatar?: string | null
    username?: string | null
    notes?: string | null
    company_id?: number | null
    remember_token?: string | null
    ldap_import?: boolean
    locale?: string | null
    show_in_list?: boolean
    two_factor_secret?: string | null
    two_factor_enrolled?: boolean
    two_factor_optin?: boolean
    department_id?: number | null
    address?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    skin?: string | null
    remote?: number | null
    status?: string | null
    role?: string | null
    department?: string | null
    accessmapid?: string | null
    ldap_server_status?: string | null
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email?: string | null
    password?: string | null
    permissions?: string | null
    activated?: boolean
    created_by?: number | null
    activation_code?: string | null
    activated_at?: Date | string | null
    last_login?: Date | string | null
    persist_code?: string | null
    reset_password_code?: string | null
    first_name?: string | null
    last_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    deleted_at?: Date | string | null
    website?: string | null
    country?: string | null
    gravatar?: string | null
    location_id?: number | null
    phone?: string | null
    jobtitle?: string | null
    manager_id?: number | null
    employee_num?: string | null
    avatar?: string | null
    username?: string | null
    notes?: string | null
    company_id?: number | null
    remember_token?: string | null
    ldap_import?: boolean
    locale?: string | null
    show_in_list?: boolean
    two_factor_secret?: string | null
    two_factor_enrolled?: boolean
    two_factor_optin?: boolean
    department_id?: number | null
    address?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    skin?: string | null
    remote?: number | null
    status?: string | null
    role?: string | null
    department?: string | null
    accessmapid?: string | null
    ldap_server_status?: string | null
  }

  export type UserUpdateInput = {
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: BoolFieldUpdateOperationsInput | boolean
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    activation_code?: NullableStringFieldUpdateOperationsInput | string | null
    activated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    persist_code?: NullableStringFieldUpdateOperationsInput | string | null
    reset_password_code?: NullableStringFieldUpdateOperationsInput | string | null
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    gravatar?: NullableStringFieldUpdateOperationsInput | string | null
    location_id?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    jobtitle?: NullableStringFieldUpdateOperationsInput | string | null
    manager_id?: NullableIntFieldUpdateOperationsInput | number | null
    employee_num?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    company_id?: NullableIntFieldUpdateOperationsInput | number | null
    remember_token?: NullableStringFieldUpdateOperationsInput | string | null
    ldap_import?: BoolFieldUpdateOperationsInput | boolean
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    show_in_list?: BoolFieldUpdateOperationsInput | boolean
    two_factor_secret?: NullableStringFieldUpdateOperationsInput | string | null
    two_factor_enrolled?: BoolFieldUpdateOperationsInput | boolean
    two_factor_optin?: BoolFieldUpdateOperationsInput | boolean
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    skin?: NullableStringFieldUpdateOperationsInput | string | null
    remote?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    accessmapid?: NullableStringFieldUpdateOperationsInput | string | null
    ldap_server_status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: BoolFieldUpdateOperationsInput | boolean
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    activation_code?: NullableStringFieldUpdateOperationsInput | string | null
    activated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    persist_code?: NullableStringFieldUpdateOperationsInput | string | null
    reset_password_code?: NullableStringFieldUpdateOperationsInput | string | null
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    gravatar?: NullableStringFieldUpdateOperationsInput | string | null
    location_id?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    jobtitle?: NullableStringFieldUpdateOperationsInput | string | null
    manager_id?: NullableIntFieldUpdateOperationsInput | number | null
    employee_num?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    company_id?: NullableIntFieldUpdateOperationsInput | number | null
    remember_token?: NullableStringFieldUpdateOperationsInput | string | null
    ldap_import?: BoolFieldUpdateOperationsInput | boolean
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    show_in_list?: BoolFieldUpdateOperationsInput | boolean
    two_factor_secret?: NullableStringFieldUpdateOperationsInput | string | null
    two_factor_enrolled?: BoolFieldUpdateOperationsInput | boolean
    two_factor_optin?: BoolFieldUpdateOperationsInput | boolean
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    skin?: NullableStringFieldUpdateOperationsInput | string | null
    remote?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    accessmapid?: NullableStringFieldUpdateOperationsInput | string | null
    ldap_server_status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateManyInput = {
    id?: number
    email?: string | null
    password?: string | null
    permissions?: string | null
    activated?: boolean
    created_by?: number | null
    activation_code?: string | null
    activated_at?: Date | string | null
    last_login?: Date | string | null
    persist_code?: string | null
    reset_password_code?: string | null
    first_name?: string | null
    last_name?: string | null
    created_at?: Date | string | null
    updated_at?: Date | string | null
    deleted_at?: Date | string | null
    website?: string | null
    country?: string | null
    gravatar?: string | null
    location_id?: number | null
    phone?: string | null
    jobtitle?: string | null
    manager_id?: number | null
    employee_num?: string | null
    avatar?: string | null
    username?: string | null
    notes?: string | null
    company_id?: number | null
    remember_token?: string | null
    ldap_import?: boolean
    locale?: string | null
    show_in_list?: boolean
    two_factor_secret?: string | null
    two_factor_enrolled?: boolean
    two_factor_optin?: boolean
    department_id?: number | null
    address?: string | null
    city?: string | null
    state?: string | null
    zip?: string | null
    skin?: string | null
    remote?: number | null
    status?: string | null
    role?: string | null
    department?: string | null
    accessmapid?: string | null
    ldap_server_status?: string | null
  }

  export type UserUpdateManyMutationInput = {
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: BoolFieldUpdateOperationsInput | boolean
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    activation_code?: NullableStringFieldUpdateOperationsInput | string | null
    activated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    persist_code?: NullableStringFieldUpdateOperationsInput | string | null
    reset_password_code?: NullableStringFieldUpdateOperationsInput | string | null
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    gravatar?: NullableStringFieldUpdateOperationsInput | string | null
    location_id?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    jobtitle?: NullableStringFieldUpdateOperationsInput | string | null
    manager_id?: NullableIntFieldUpdateOperationsInput | number | null
    employee_num?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    company_id?: NullableIntFieldUpdateOperationsInput | number | null
    remember_token?: NullableStringFieldUpdateOperationsInput | string | null
    ldap_import?: BoolFieldUpdateOperationsInput | boolean
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    show_in_list?: BoolFieldUpdateOperationsInput | boolean
    two_factor_secret?: NullableStringFieldUpdateOperationsInput | string | null
    two_factor_enrolled?: BoolFieldUpdateOperationsInput | boolean
    two_factor_optin?: BoolFieldUpdateOperationsInput | boolean
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    skin?: NullableStringFieldUpdateOperationsInput | string | null
    remote?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    accessmapid?: NullableStringFieldUpdateOperationsInput | string | null
    ldap_server_status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    permissions?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: BoolFieldUpdateOperationsInput | boolean
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    activation_code?: NullableStringFieldUpdateOperationsInput | string | null
    activated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    last_login?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    persist_code?: NullableStringFieldUpdateOperationsInput | string | null
    reset_password_code?: NullableStringFieldUpdateOperationsInput | string | null
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updated_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    website?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    gravatar?: NullableStringFieldUpdateOperationsInput | string | null
    location_id?: NullableIntFieldUpdateOperationsInput | number | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    jobtitle?: NullableStringFieldUpdateOperationsInput | string | null
    manager_id?: NullableIntFieldUpdateOperationsInput | number | null
    employee_num?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    company_id?: NullableIntFieldUpdateOperationsInput | number | null
    remember_token?: NullableStringFieldUpdateOperationsInput | string | null
    ldap_import?: BoolFieldUpdateOperationsInput | boolean
    locale?: NullableStringFieldUpdateOperationsInput | string | null
    show_in_list?: BoolFieldUpdateOperationsInput | boolean
    two_factor_secret?: NullableStringFieldUpdateOperationsInput | string | null
    two_factor_enrolled?: BoolFieldUpdateOperationsInput | boolean
    two_factor_optin?: BoolFieldUpdateOperationsInput | boolean
    department_id?: NullableIntFieldUpdateOperationsInput | number | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip?: NullableStringFieldUpdateOperationsInput | string | null
    skin?: NullableStringFieldUpdateOperationsInput | string | null
    remote?: NullableIntFieldUpdateOperationsInput | number | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    accessmapid?: NullableStringFieldUpdateOperationsInput | string | null
    ldap_server_status?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type QueueCreateInput = {
    id?: bigint | number
    idbu?: string | null
    code?: string | null
    Date: Date | string
    antedatequeueid?: bigint | number | null
    antedate?: Date | string | null
    antedatecode?: string | null
    antedatetime?: Date | string | null
    antedatestatus: number
    antedatereason?: string | null
    antedateapprovedby?: string | null
    antedateapproveddate?: Date | string | null
    datetime: Date | string
    idpatient: bigint | number
    qfullname?: string | null
    qlastname?: string | null
    qfirstname?: string | null
    qmiddlename?: string | null
    qgender?: string | null
    qdob?: Date | string | null
    qfulladdress?: string | null
    agepatient?: number | null
    status: number
    accessionno?: string | null
    notes?: string | null
    cancelreason?: string | null
    patienttype?: string | null
    picture?: string | null
    inputby?: string | null
    lab2labid?: string | null
    labbarcode?: string | null
    labid?: string | null
    updatedate?: Date | string | null
    updateby?: string | null
    erosstatus?: string | null
    systemupdatetime?: Date | string | null
  }

  export type QueueUncheckedCreateInput = {
    id?: bigint | number
    idbu?: string | null
    code?: string | null
    Date: Date | string
    antedatequeueid?: bigint | number | null
    antedate?: Date | string | null
    antedatecode?: string | null
    antedatetime?: Date | string | null
    antedatestatus: number
    antedatereason?: string | null
    antedateapprovedby?: string | null
    antedateapproveddate?: Date | string | null
    datetime: Date | string
    idpatient: bigint | number
    qfullname?: string | null
    qlastname?: string | null
    qfirstname?: string | null
    qmiddlename?: string | null
    qgender?: string | null
    qdob?: Date | string | null
    qfulladdress?: string | null
    agepatient?: number | null
    status: number
    accessionno?: string | null
    notes?: string | null
    cancelreason?: string | null
    patienttype?: string | null
    picture?: string | null
    inputby?: string | null
    lab2labid?: string | null
    labbarcode?: string | null
    labid?: string | null
    updatedate?: Date | string | null
    updateby?: string | null
    erosstatus?: string | null
    systemupdatetime?: Date | string | null
  }

  export type QueueUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    idbu?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    Date?: DateTimeFieldUpdateOperationsInput | Date | string
    antedatequeueid?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    antedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    antedatecode?: NullableStringFieldUpdateOperationsInput | string | null
    antedatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    antedatestatus?: IntFieldUpdateOperationsInput | number
    antedatereason?: NullableStringFieldUpdateOperationsInput | string | null
    antedateapprovedby?: NullableStringFieldUpdateOperationsInput | string | null
    antedateapproveddate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    datetime?: DateTimeFieldUpdateOperationsInput | Date | string
    idpatient?: BigIntFieldUpdateOperationsInput | bigint | number
    qfullname?: NullableStringFieldUpdateOperationsInput | string | null
    qlastname?: NullableStringFieldUpdateOperationsInput | string | null
    qfirstname?: NullableStringFieldUpdateOperationsInput | string | null
    qmiddlename?: NullableStringFieldUpdateOperationsInput | string | null
    qgender?: NullableStringFieldUpdateOperationsInput | string | null
    qdob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    qfulladdress?: NullableStringFieldUpdateOperationsInput | string | null
    agepatient?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    accessionno?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    cancelreason?: NullableStringFieldUpdateOperationsInput | string | null
    patienttype?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    lab2labid?: NullableStringFieldUpdateOperationsInput | string | null
    labbarcode?: NullableStringFieldUpdateOperationsInput | string | null
    labid?: NullableStringFieldUpdateOperationsInput | string | null
    updatedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateby?: NullableStringFieldUpdateOperationsInput | string | null
    erosstatus?: NullableStringFieldUpdateOperationsInput | string | null
    systemupdatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QueueUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    idbu?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    Date?: DateTimeFieldUpdateOperationsInput | Date | string
    antedatequeueid?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    antedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    antedatecode?: NullableStringFieldUpdateOperationsInput | string | null
    antedatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    antedatestatus?: IntFieldUpdateOperationsInput | number
    antedatereason?: NullableStringFieldUpdateOperationsInput | string | null
    antedateapprovedby?: NullableStringFieldUpdateOperationsInput | string | null
    antedateapproveddate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    datetime?: DateTimeFieldUpdateOperationsInput | Date | string
    idpatient?: BigIntFieldUpdateOperationsInput | bigint | number
    qfullname?: NullableStringFieldUpdateOperationsInput | string | null
    qlastname?: NullableStringFieldUpdateOperationsInput | string | null
    qfirstname?: NullableStringFieldUpdateOperationsInput | string | null
    qmiddlename?: NullableStringFieldUpdateOperationsInput | string | null
    qgender?: NullableStringFieldUpdateOperationsInput | string | null
    qdob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    qfulladdress?: NullableStringFieldUpdateOperationsInput | string | null
    agepatient?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    accessionno?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    cancelreason?: NullableStringFieldUpdateOperationsInput | string | null
    patienttype?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    lab2labid?: NullableStringFieldUpdateOperationsInput | string | null
    labbarcode?: NullableStringFieldUpdateOperationsInput | string | null
    labid?: NullableStringFieldUpdateOperationsInput | string | null
    updatedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateby?: NullableStringFieldUpdateOperationsInput | string | null
    erosstatus?: NullableStringFieldUpdateOperationsInput | string | null
    systemupdatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QueueCreateManyInput = {
    id?: bigint | number
    idbu?: string | null
    code?: string | null
    Date: Date | string
    antedatequeueid?: bigint | number | null
    antedate?: Date | string | null
    antedatecode?: string | null
    antedatetime?: Date | string | null
    antedatestatus: number
    antedatereason?: string | null
    antedateapprovedby?: string | null
    antedateapproveddate?: Date | string | null
    datetime: Date | string
    idpatient: bigint | number
    qfullname?: string | null
    qlastname?: string | null
    qfirstname?: string | null
    qmiddlename?: string | null
    qgender?: string | null
    qdob?: Date | string | null
    qfulladdress?: string | null
    agepatient?: number | null
    status: number
    accessionno?: string | null
    notes?: string | null
    cancelreason?: string | null
    patienttype?: string | null
    picture?: string | null
    inputby?: string | null
    lab2labid?: string | null
    labbarcode?: string | null
    labid?: string | null
    updatedate?: Date | string | null
    updateby?: string | null
    erosstatus?: string | null
    systemupdatetime?: Date | string | null
  }

  export type QueueUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    idbu?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    Date?: DateTimeFieldUpdateOperationsInput | Date | string
    antedatequeueid?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    antedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    antedatecode?: NullableStringFieldUpdateOperationsInput | string | null
    antedatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    antedatestatus?: IntFieldUpdateOperationsInput | number
    antedatereason?: NullableStringFieldUpdateOperationsInput | string | null
    antedateapprovedby?: NullableStringFieldUpdateOperationsInput | string | null
    antedateapproveddate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    datetime?: DateTimeFieldUpdateOperationsInput | Date | string
    idpatient?: BigIntFieldUpdateOperationsInput | bigint | number
    qfullname?: NullableStringFieldUpdateOperationsInput | string | null
    qlastname?: NullableStringFieldUpdateOperationsInput | string | null
    qfirstname?: NullableStringFieldUpdateOperationsInput | string | null
    qmiddlename?: NullableStringFieldUpdateOperationsInput | string | null
    qgender?: NullableStringFieldUpdateOperationsInput | string | null
    qdob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    qfulladdress?: NullableStringFieldUpdateOperationsInput | string | null
    agepatient?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    accessionno?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    cancelreason?: NullableStringFieldUpdateOperationsInput | string | null
    patienttype?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    lab2labid?: NullableStringFieldUpdateOperationsInput | string | null
    labbarcode?: NullableStringFieldUpdateOperationsInput | string | null
    labid?: NullableStringFieldUpdateOperationsInput | string | null
    updatedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateby?: NullableStringFieldUpdateOperationsInput | string | null
    erosstatus?: NullableStringFieldUpdateOperationsInput | string | null
    systemupdatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type QueueUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    idbu?: NullableStringFieldUpdateOperationsInput | string | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    Date?: DateTimeFieldUpdateOperationsInput | Date | string
    antedatequeueid?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    antedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    antedatecode?: NullableStringFieldUpdateOperationsInput | string | null
    antedatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    antedatestatus?: IntFieldUpdateOperationsInput | number
    antedatereason?: NullableStringFieldUpdateOperationsInput | string | null
    antedateapprovedby?: NullableStringFieldUpdateOperationsInput | string | null
    antedateapproveddate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    datetime?: DateTimeFieldUpdateOperationsInput | Date | string
    idpatient?: BigIntFieldUpdateOperationsInput | bigint | number
    qfullname?: NullableStringFieldUpdateOperationsInput | string | null
    qlastname?: NullableStringFieldUpdateOperationsInput | string | null
    qfirstname?: NullableStringFieldUpdateOperationsInput | string | null
    qmiddlename?: NullableStringFieldUpdateOperationsInput | string | null
    qgender?: NullableStringFieldUpdateOperationsInput | string | null
    qdob?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    qfulladdress?: NullableStringFieldUpdateOperationsInput | string | null
    agepatient?: NullableIntFieldUpdateOperationsInput | number | null
    status?: IntFieldUpdateOperationsInput | number
    accessionno?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    cancelreason?: NullableStringFieldUpdateOperationsInput | string | null
    patienttype?: NullableStringFieldUpdateOperationsInput | string | null
    picture?: NullableStringFieldUpdateOperationsInput | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    lab2labid?: NullableStringFieldUpdateOperationsInput | string | null
    labbarcode?: NullableStringFieldUpdateOperationsInput | string | null
    labid?: NullableStringFieldUpdateOperationsInput | string | null
    updatedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateby?: NullableStringFieldUpdateOperationsInput | string | null
    erosstatus?: NullableStringFieldUpdateOperationsInput | string | null
    systemupdatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CmsVitalsCreateInput = {
    id?: bigint | number
    idqueue: bigint | number
    medication?: string | null
    lastdose?: Date | string | null
    lastperiod?: Date | string | null
    inputby?: string | null
    inputdatetime?: Date | string | null
  }

  export type CmsVitalsUncheckedCreateInput = {
    id?: bigint | number
    idqueue: bigint | number
    medication?: string | null
    lastdose?: Date | string | null
    lastperiod?: Date | string | null
    inputby?: string | null
    inputdatetime?: Date | string | null
  }

  export type CmsVitalsUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    idqueue?: BigIntFieldUpdateOperationsInput | bigint | number
    medication?: NullableStringFieldUpdateOperationsInput | string | null
    lastdose?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastperiod?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    inputdatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CmsVitalsUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    idqueue?: BigIntFieldUpdateOperationsInput | bigint | number
    medication?: NullableStringFieldUpdateOperationsInput | string | null
    lastdose?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastperiod?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    inputdatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CmsVitalsCreateManyInput = {
    id?: bigint | number
    idqueue: bigint | number
    medication?: string | null
    lastdose?: Date | string | null
    lastperiod?: Date | string | null
    inputby?: string | null
    inputdatetime?: Date | string | null
  }

  export type CmsVitalsUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    idqueue?: BigIntFieldUpdateOperationsInput | bigint | number
    medication?: NullableStringFieldUpdateOperationsInput | string | null
    lastdose?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastperiod?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    inputdatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CmsVitalsUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    idqueue?: BigIntFieldUpdateOperationsInput | bigint | number
    medication?: NullableStringFieldUpdateOperationsInput | string | null
    lastdose?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastperiod?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    inputdatetime?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PatientCreateInput = {
    id: bigint | number
    code?: string | null
    fullname?: string | null
    lastname?: string | null
    firstname?: string | null
    middlename?: string | null
    suffix?: string | null
    prefix?: string | null
    gender?: string | null
    dob: Date | string
    email?: string | null
    fulladdress?: string | null
    address?: string | null
    barangay?: string | null
    barangayname?: string | null
    city?: string | null
    cityname?: string | null
    state?: string | null
    zipcode?: string | null
    nationality?: string | null
    country?: string | null
    religion?: string | null
    contactno?: string | null
    moblie?: string | null
    faxno?: string | null
    philhealth?: string | null
    seniorid?: string | null
    pwd?: string | null
    expirydatepwd?: Date | string | null
    status?: string | null
    isactive: number
    remarks?: string | null
    picturelink?: string | null
    uploadid?: string | null
    inputdate?: Date | string | null
    inputby?: string | null
    updatedate?: Date | string | null
    updateby?: string | null
    lastvisit?: Date | string | null
    passportno?: string | null
    employeeid?: string | null
    rdob?: string | null
    uploaddatetime: Date | string
  }

  export type PatientUncheckedCreateInput = {
    id: bigint | number
    code?: string | null
    fullname?: string | null
    lastname?: string | null
    firstname?: string | null
    middlename?: string | null
    suffix?: string | null
    prefix?: string | null
    gender?: string | null
    dob: Date | string
    email?: string | null
    fulladdress?: string | null
    address?: string | null
    barangay?: string | null
    barangayname?: string | null
    city?: string | null
    cityname?: string | null
    state?: string | null
    zipcode?: string | null
    nationality?: string | null
    country?: string | null
    religion?: string | null
    contactno?: string | null
    moblie?: string | null
    faxno?: string | null
    philhealth?: string | null
    seniorid?: string | null
    pwd?: string | null
    expirydatepwd?: Date | string | null
    status?: string | null
    isactive: number
    remarks?: string | null
    picturelink?: string | null
    uploadid?: string | null
    inputdate?: Date | string | null
    inputby?: string | null
    updatedate?: Date | string | null
    updateby?: string | null
    lastvisit?: Date | string | null
    passportno?: string | null
    employeeid?: string | null
    rdob?: string | null
    uploaddatetime: Date | string
  }

  export type PatientUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    middlename?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dob?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fulladdress?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    barangayname?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    cityname?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipcode?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    religion?: NullableStringFieldUpdateOperationsInput | string | null
    contactno?: NullableStringFieldUpdateOperationsInput | string | null
    moblie?: NullableStringFieldUpdateOperationsInput | string | null
    faxno?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    seniorid?: NullableStringFieldUpdateOperationsInput | string | null
    pwd?: NullableStringFieldUpdateOperationsInput | string | null
    expirydatepwd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    isactive?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    picturelink?: NullableStringFieldUpdateOperationsInput | string | null
    uploadid?: NullableStringFieldUpdateOperationsInput | string | null
    inputdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    updatedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateby?: NullableStringFieldUpdateOperationsInput | string | null
    lastvisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passportno?: NullableStringFieldUpdateOperationsInput | string | null
    employeeid?: NullableStringFieldUpdateOperationsInput | string | null
    rdob?: NullableStringFieldUpdateOperationsInput | string | null
    uploaddatetime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    middlename?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dob?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fulladdress?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    barangayname?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    cityname?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipcode?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    religion?: NullableStringFieldUpdateOperationsInput | string | null
    contactno?: NullableStringFieldUpdateOperationsInput | string | null
    moblie?: NullableStringFieldUpdateOperationsInput | string | null
    faxno?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    seniorid?: NullableStringFieldUpdateOperationsInput | string | null
    pwd?: NullableStringFieldUpdateOperationsInput | string | null
    expirydatepwd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    isactive?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    picturelink?: NullableStringFieldUpdateOperationsInput | string | null
    uploadid?: NullableStringFieldUpdateOperationsInput | string | null
    inputdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    updatedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateby?: NullableStringFieldUpdateOperationsInput | string | null
    lastvisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passportno?: NullableStringFieldUpdateOperationsInput | string | null
    employeeid?: NullableStringFieldUpdateOperationsInput | string | null
    rdob?: NullableStringFieldUpdateOperationsInput | string | null
    uploaddatetime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientCreateManyInput = {
    id: bigint | number
    code?: string | null
    fullname?: string | null
    lastname?: string | null
    firstname?: string | null
    middlename?: string | null
    suffix?: string | null
    prefix?: string | null
    gender?: string | null
    dob: Date | string
    email?: string | null
    fulladdress?: string | null
    address?: string | null
    barangay?: string | null
    barangayname?: string | null
    city?: string | null
    cityname?: string | null
    state?: string | null
    zipcode?: string | null
    nationality?: string | null
    country?: string | null
    religion?: string | null
    contactno?: string | null
    moblie?: string | null
    faxno?: string | null
    philhealth?: string | null
    seniorid?: string | null
    pwd?: string | null
    expirydatepwd?: Date | string | null
    status?: string | null
    isactive: number
    remarks?: string | null
    picturelink?: string | null
    uploadid?: string | null
    inputdate?: Date | string | null
    inputby?: string | null
    updatedate?: Date | string | null
    updateby?: string | null
    lastvisit?: Date | string | null
    passportno?: string | null
    employeeid?: string | null
    rdob?: string | null
    uploaddatetime: Date | string
  }

  export type PatientUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    middlename?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dob?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fulladdress?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    barangayname?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    cityname?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipcode?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    religion?: NullableStringFieldUpdateOperationsInput | string | null
    contactno?: NullableStringFieldUpdateOperationsInput | string | null
    moblie?: NullableStringFieldUpdateOperationsInput | string | null
    faxno?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    seniorid?: NullableStringFieldUpdateOperationsInput | string | null
    pwd?: NullableStringFieldUpdateOperationsInput | string | null
    expirydatepwd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    isactive?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    picturelink?: NullableStringFieldUpdateOperationsInput | string | null
    uploadid?: NullableStringFieldUpdateOperationsInput | string | null
    inputdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    updatedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateby?: NullableStringFieldUpdateOperationsInput | string | null
    lastvisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passportno?: NullableStringFieldUpdateOperationsInput | string | null
    employeeid?: NullableStringFieldUpdateOperationsInput | string | null
    rdob?: NullableStringFieldUpdateOperationsInput | string | null
    uploaddatetime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PatientUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    code?: NullableStringFieldUpdateOperationsInput | string | null
    fullname?: NullableStringFieldUpdateOperationsInput | string | null
    lastname?: NullableStringFieldUpdateOperationsInput | string | null
    firstname?: NullableStringFieldUpdateOperationsInput | string | null
    middlename?: NullableStringFieldUpdateOperationsInput | string | null
    suffix?: NullableStringFieldUpdateOperationsInput | string | null
    prefix?: NullableStringFieldUpdateOperationsInput | string | null
    gender?: NullableStringFieldUpdateOperationsInput | string | null
    dob?: DateTimeFieldUpdateOperationsInput | Date | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    fulladdress?: NullableStringFieldUpdateOperationsInput | string | null
    address?: NullableStringFieldUpdateOperationsInput | string | null
    barangay?: NullableStringFieldUpdateOperationsInput | string | null
    barangayname?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    cityname?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zipcode?: NullableStringFieldUpdateOperationsInput | string | null
    nationality?: NullableStringFieldUpdateOperationsInput | string | null
    country?: NullableStringFieldUpdateOperationsInput | string | null
    religion?: NullableStringFieldUpdateOperationsInput | string | null
    contactno?: NullableStringFieldUpdateOperationsInput | string | null
    moblie?: NullableStringFieldUpdateOperationsInput | string | null
    faxno?: NullableStringFieldUpdateOperationsInput | string | null
    philhealth?: NullableStringFieldUpdateOperationsInput | string | null
    seniorid?: NullableStringFieldUpdateOperationsInput | string | null
    pwd?: NullableStringFieldUpdateOperationsInput | string | null
    expirydatepwd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    isactive?: IntFieldUpdateOperationsInput | number
    remarks?: NullableStringFieldUpdateOperationsInput | string | null
    picturelink?: NullableStringFieldUpdateOperationsInput | string | null
    uploadid?: NullableStringFieldUpdateOperationsInput | string | null
    inputdate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inputby?: NullableStringFieldUpdateOperationsInput | string | null
    updatedate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updateby?: NullableStringFieldUpdateOperationsInput | string | null
    lastvisit?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    passportno?: NullableStringFieldUpdateOperationsInput | string | null
    employeeid?: NullableStringFieldUpdateOperationsInput | string | null
    rdob?: NullableStringFieldUpdateOperationsInput | string | null
    uploaddatetime?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardEnrollmentCreateInput = {
    cardnumber?: string | null
    dateenrolled?: Date | string | null
    receivedby?: string | null
    receiveddate?: Date | string | null
    releaseto?: string | null
    oldreleaseto?: string | null
    releaseby?: string | null
    daterelease?: Date | string | null
    transferto?: string | null
    datetransfer?: Date | string | null
    transferby?: string | null
    status?: number | null
  }

  export type CardEnrollmentUncheckedCreateInput = {
    id?: number
    cardnumber?: string | null
    dateenrolled?: Date | string | null
    receivedby?: string | null
    receiveddate?: Date | string | null
    releaseto?: string | null
    oldreleaseto?: string | null
    releaseby?: string | null
    daterelease?: Date | string | null
    transferto?: string | null
    datetransfer?: Date | string | null
    transferby?: string | null
    status?: number | null
  }

  export type CardEnrollmentUpdateInput = {
    cardnumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateenrolled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedby?: NullableStringFieldUpdateOperationsInput | string | null
    receiveddate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releaseto?: NullableStringFieldUpdateOperationsInput | string | null
    oldreleaseto?: NullableStringFieldUpdateOperationsInput | string | null
    releaseby?: NullableStringFieldUpdateOperationsInput | string | null
    daterelease?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferto?: NullableStringFieldUpdateOperationsInput | string | null
    datetransfer?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferby?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CardEnrollmentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    cardnumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateenrolled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedby?: NullableStringFieldUpdateOperationsInput | string | null
    receiveddate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releaseto?: NullableStringFieldUpdateOperationsInput | string | null
    oldreleaseto?: NullableStringFieldUpdateOperationsInput | string | null
    releaseby?: NullableStringFieldUpdateOperationsInput | string | null
    daterelease?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferto?: NullableStringFieldUpdateOperationsInput | string | null
    datetransfer?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferby?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CardEnrollmentCreateManyInput = {
    id?: number
    cardnumber?: string | null
    dateenrolled?: Date | string | null
    receivedby?: string | null
    receiveddate?: Date | string | null
    releaseto?: string | null
    oldreleaseto?: string | null
    releaseby?: string | null
    daterelease?: Date | string | null
    transferto?: string | null
    datetransfer?: Date | string | null
    transferby?: string | null
    status?: number | null
  }

  export type CardEnrollmentUpdateManyMutationInput = {
    cardnumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateenrolled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedby?: NullableStringFieldUpdateOperationsInput | string | null
    receiveddate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releaseto?: NullableStringFieldUpdateOperationsInput | string | null
    oldreleaseto?: NullableStringFieldUpdateOperationsInput | string | null
    releaseby?: NullableStringFieldUpdateOperationsInput | string | null
    daterelease?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferto?: NullableStringFieldUpdateOperationsInput | string | null
    datetransfer?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferby?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CardEnrollmentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    cardnumber?: NullableStringFieldUpdateOperationsInput | string | null
    dateenrolled?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    receivedby?: NullableStringFieldUpdateOperationsInput | string | null
    receiveddate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    releaseto?: NullableStringFieldUpdateOperationsInput | string | null
    oldreleaseto?: NullableStringFieldUpdateOperationsInput | string | null
    releaseby?: NullableStringFieldUpdateOperationsInput | string | null
    daterelease?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferto?: NullableStringFieldUpdateOperationsInput | string | null
    datetransfer?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferby?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type CardNumberCreateInput = {
    year?: number | null
    batch?: number | null
    month?: number | null
    seriesnum?: number | null
    maskedseries?: string | null
    generatedcardnumber: string
    codecompany?: string | null
    generatedby?: string | null
  }

  export type CardNumberUncheckedCreateInput = {
    id?: number
    year?: number | null
    batch?: number | null
    month?: number | null
    seriesnum?: number | null
    maskedseries?: string | null
    generatedcardnumber: string
    codecompany?: string | null
    generatedby?: string | null
  }

  export type CardNumberUpdateInput = {
    year?: NullableIntFieldUpdateOperationsInput | number | null
    batch?: NullableIntFieldUpdateOperationsInput | number | null
    month?: NullableIntFieldUpdateOperationsInput | number | null
    seriesnum?: NullableIntFieldUpdateOperationsInput | number | null
    maskedseries?: NullableStringFieldUpdateOperationsInput | string | null
    generatedcardnumber?: StringFieldUpdateOperationsInput | string
    codecompany?: NullableStringFieldUpdateOperationsInput | string | null
    generatedby?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CardNumberUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    batch?: NullableIntFieldUpdateOperationsInput | number | null
    month?: NullableIntFieldUpdateOperationsInput | number | null
    seriesnum?: NullableIntFieldUpdateOperationsInput | number | null
    maskedseries?: NullableStringFieldUpdateOperationsInput | string | null
    generatedcardnumber?: StringFieldUpdateOperationsInput | string
    codecompany?: NullableStringFieldUpdateOperationsInput | string | null
    generatedby?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CardNumberCreateManyInput = {
    id?: number
    year?: number | null
    batch?: number | null
    month?: number | null
    seriesnum?: number | null
    maskedseries?: string | null
    generatedcardnumber: string
    codecompany?: string | null
    generatedby?: string | null
  }

  export type CardNumberUpdateManyMutationInput = {
    year?: NullableIntFieldUpdateOperationsInput | number | null
    batch?: NullableIntFieldUpdateOperationsInput | number | null
    month?: NullableIntFieldUpdateOperationsInput | number | null
    seriesnum?: NullableIntFieldUpdateOperationsInput | number | null
    maskedseries?: NullableStringFieldUpdateOperationsInput | string | null
    generatedcardnumber?: StringFieldUpdateOperationsInput | string
    codecompany?: NullableStringFieldUpdateOperationsInput | string | null
    generatedby?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CardNumberUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    year?: NullableIntFieldUpdateOperationsInput | number | null
    batch?: NullableIntFieldUpdateOperationsInput | number | null
    month?: NullableIntFieldUpdateOperationsInput | number | null
    seriesnum?: NullableIntFieldUpdateOperationsInput | number | null
    maskedseries?: NullableStringFieldUpdateOperationsInput | string | null
    generatedcardnumber?: StringFieldUpdateOperationsInput | string
    codecompany?: NullableStringFieldUpdateOperationsInput | string | null
    generatedby?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CardVerifiedCreateInput = {
    verifiedcardnumbers: string
    ictreceived?: string | null
    datereceived?: Date | string | null
  }

  export type CardVerifiedUncheckedCreateInput = {
    id?: number
    verifiedcardnumbers: string
    ictreceived?: string | null
    datereceived?: Date | string | null
  }

  export type CardVerifiedUpdateInput = {
    verifiedcardnumbers?: StringFieldUpdateOperationsInput | string
    ictreceived?: NullableStringFieldUpdateOperationsInput | string | null
    datereceived?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CardVerifiedUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    verifiedcardnumbers?: StringFieldUpdateOperationsInput | string
    ictreceived?: NullableStringFieldUpdateOperationsInput | string | null
    datereceived?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CardVerifiedCreateManyInput = {
    id?: number
    verifiedcardnumbers: string
    ictreceived?: string | null
    datereceived?: Date | string | null
  }

  export type CardVerifiedUpdateManyMutationInput = {
    verifiedcardnumbers?: StringFieldUpdateOperationsInput | string
    ictreceived?: NullableStringFieldUpdateOperationsInput | string | null
    datereceived?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CardVerifiedUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    verifiedcardnumbers?: StringFieldUpdateOperationsInput | string
    ictreceived?: NullableStringFieldUpdateOperationsInput | string | null
    datereceived?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type CmsCompanyCreateInput = {
    server?: string | null
    idcompany?: bigint | number | null
    code?: string | null
    name?: string | null
    status?: string | null
    billingtype?: string | null
  }

  export type CmsCompanyUncheckedCreateInput = {
    id?: number
    server?: string | null
    idcompany?: bigint | number | null
    code?: string | null
    name?: string | null
    status?: string | null
    billingtype?: string | null
  }

  export type CmsCompanyUpdateInput = {
    server?: NullableStringFieldUpdateOperationsInput | string | null
    idcompany?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    billingtype?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CmsCompanyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    server?: NullableStringFieldUpdateOperationsInput | string | null
    idcompany?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    billingtype?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CmsCompanyCreateManyInput = {
    id?: number
    server?: string | null
    idcompany?: bigint | number | null
    code?: string | null
    name?: string | null
    status?: string | null
    billingtype?: string | null
  }

  export type CmsCompanyUpdateManyMutationInput = {
    server?: NullableStringFieldUpdateOperationsInput | string | null
    idcompany?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    billingtype?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CmsCompanyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    server?: NullableStringFieldUpdateOperationsInput | string | null
    idcompany?: NullableBigIntFieldUpdateOperationsInput | bigint | number | null
    code?: NullableStringFieldUpdateOperationsInput | string | null
    name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: NullableStringFieldUpdateOperationsInput | string | null
    billingtype?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ConsultationNoteCreateInput = {
    queue_id: number
    patient_id: string
    status?: string
    is_draft?: number
    chief_complaint?: string | null
    history_illness?: string | null
    past_history?: string | null
    family_history?: string | null
    pe_findings?: string | null
    diagnosis?: string | null
    icd_code?: string | null
    treatment_plan?: string | null
    orders?: string | null
    pcp_doctor?: string | null
    doctor_id?: number | null
    doctor_name?: string | null
    recorded_by?: number | null
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ConsultationNoteUncheckedCreateInput = {
    id?: number
    queue_id: number
    patient_id: string
    status?: string
    is_draft?: number
    chief_complaint?: string | null
    history_illness?: string | null
    past_history?: string | null
    family_history?: string | null
    pe_findings?: string | null
    diagnosis?: string | null
    icd_code?: string | null
    treatment_plan?: string | null
    orders?: string | null
    pcp_doctor?: string | null
    doctor_id?: number | null
    doctor_name?: string | null
    recorded_by?: number | null
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ConsultationNoteUpdateInput = {
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    is_draft?: IntFieldUpdateOperationsInput | number
    chief_complaint?: NullableStringFieldUpdateOperationsInput | string | null
    history_illness?: NullableStringFieldUpdateOperationsInput | string | null
    past_history?: NullableStringFieldUpdateOperationsInput | string | null
    family_history?: NullableStringFieldUpdateOperationsInput | string | null
    pe_findings?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    icd_code?: NullableStringFieldUpdateOperationsInput | string | null
    treatment_plan?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: NullableStringFieldUpdateOperationsInput | string | null
    pcp_doctor?: NullableStringFieldUpdateOperationsInput | string | null
    doctor_id?: NullableIntFieldUpdateOperationsInput | number | null
    doctor_name?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsultationNoteUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    is_draft?: IntFieldUpdateOperationsInput | number
    chief_complaint?: NullableStringFieldUpdateOperationsInput | string | null
    history_illness?: NullableStringFieldUpdateOperationsInput | string | null
    past_history?: NullableStringFieldUpdateOperationsInput | string | null
    family_history?: NullableStringFieldUpdateOperationsInput | string | null
    pe_findings?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    icd_code?: NullableStringFieldUpdateOperationsInput | string | null
    treatment_plan?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: NullableStringFieldUpdateOperationsInput | string | null
    pcp_doctor?: NullableStringFieldUpdateOperationsInput | string | null
    doctor_id?: NullableIntFieldUpdateOperationsInput | number | null
    doctor_name?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsultationNoteCreateManyInput = {
    id?: number
    queue_id: number
    patient_id: string
    status?: string
    is_draft?: number
    chief_complaint?: string | null
    history_illness?: string | null
    past_history?: string | null
    family_history?: string | null
    pe_findings?: string | null
    diagnosis?: string | null
    icd_code?: string | null
    treatment_plan?: string | null
    orders?: string | null
    pcp_doctor?: string | null
    doctor_id?: number | null
    doctor_name?: string | null
    recorded_by?: number | null
    completed_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ConsultationNoteUpdateManyMutationInput = {
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    is_draft?: IntFieldUpdateOperationsInput | number
    chief_complaint?: NullableStringFieldUpdateOperationsInput | string | null
    history_illness?: NullableStringFieldUpdateOperationsInput | string | null
    past_history?: NullableStringFieldUpdateOperationsInput | string | null
    family_history?: NullableStringFieldUpdateOperationsInput | string | null
    pe_findings?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    icd_code?: NullableStringFieldUpdateOperationsInput | string | null
    treatment_plan?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: NullableStringFieldUpdateOperationsInput | string | null
    pcp_doctor?: NullableStringFieldUpdateOperationsInput | string | null
    doctor_id?: NullableIntFieldUpdateOperationsInput | number | null
    doctor_name?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConsultationNoteUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    is_draft?: IntFieldUpdateOperationsInput | number
    chief_complaint?: NullableStringFieldUpdateOperationsInput | string | null
    history_illness?: NullableStringFieldUpdateOperationsInput | string | null
    past_history?: NullableStringFieldUpdateOperationsInput | string | null
    family_history?: NullableStringFieldUpdateOperationsInput | string | null
    pe_findings?: NullableStringFieldUpdateOperationsInput | string | null
    diagnosis?: NullableStringFieldUpdateOperationsInput | string | null
    icd_code?: NullableStringFieldUpdateOperationsInput | string | null
    treatment_plan?: NullableStringFieldUpdateOperationsInput | string | null
    orders?: NullableStringFieldUpdateOperationsInput | string | null
    pcp_doctor?: NullableStringFieldUpdateOperationsInput | string | null
    doctor_id?: NullableIntFieldUpdateOperationsInput | number | null
    doctor_name?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalsCreateInput = {
    queue_id: number
    patient_id?: string | null
    bp_systolic?: number | null
    bp_diastolic?: number | null
    bp_systolic2?: number | null
    bp_diastolic2?: number | null
    bp_systolic3?: number | null
    bp_diastolic3?: number | null
    heart_rate?: number | null
    temperature?: number | null
    respiratory_rate?: number | null
    o2_saturation?: number | null
    weight_kg?: number | null
    height_cm?: number | null
    bmi?: number | null
    vision_right_od?: string | null
    vision_left_os?: string | null
    vision_corrected?: string | null
    color_vision?: string | null
    chief_complaint?: string | null
    pcp_doctor?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type VitalsUncheckedCreateInput = {
    id?: number
    queue_id: number
    patient_id?: string | null
    bp_systolic?: number | null
    bp_diastolic?: number | null
    bp_systolic2?: number | null
    bp_diastolic2?: number | null
    bp_systolic3?: number | null
    bp_diastolic3?: number | null
    heart_rate?: number | null
    temperature?: number | null
    respiratory_rate?: number | null
    o2_saturation?: number | null
    weight_kg?: number | null
    height_cm?: number | null
    bmi?: number | null
    vision_right_od?: string | null
    vision_left_os?: string | null
    vision_corrected?: string | null
    color_vision?: string | null
    chief_complaint?: string | null
    pcp_doctor?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type VitalsUpdateInput = {
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    bp_systolic?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic?: NullableIntFieldUpdateOperationsInput | number | null
    bp_systolic2?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic2?: NullableIntFieldUpdateOperationsInput | number | null
    bp_systolic3?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic3?: NullableIntFieldUpdateOperationsInput | number | null
    heart_rate?: NullableIntFieldUpdateOperationsInput | number | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    respiratory_rate?: NullableIntFieldUpdateOperationsInput | number | null
    o2_saturation?: NullableFloatFieldUpdateOperationsInput | number | null
    weight_kg?: NullableFloatFieldUpdateOperationsInput | number | null
    height_cm?: NullableFloatFieldUpdateOperationsInput | number | null
    bmi?: NullableFloatFieldUpdateOperationsInput | number | null
    vision_right_od?: NullableStringFieldUpdateOperationsInput | string | null
    vision_left_os?: NullableStringFieldUpdateOperationsInput | string | null
    vision_corrected?: NullableStringFieldUpdateOperationsInput | string | null
    color_vision?: NullableStringFieldUpdateOperationsInput | string | null
    chief_complaint?: NullableStringFieldUpdateOperationsInput | string | null
    pcp_doctor?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalsUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    bp_systolic?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic?: NullableIntFieldUpdateOperationsInput | number | null
    bp_systolic2?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic2?: NullableIntFieldUpdateOperationsInput | number | null
    bp_systolic3?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic3?: NullableIntFieldUpdateOperationsInput | number | null
    heart_rate?: NullableIntFieldUpdateOperationsInput | number | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    respiratory_rate?: NullableIntFieldUpdateOperationsInput | number | null
    o2_saturation?: NullableFloatFieldUpdateOperationsInput | number | null
    weight_kg?: NullableFloatFieldUpdateOperationsInput | number | null
    height_cm?: NullableFloatFieldUpdateOperationsInput | number | null
    bmi?: NullableFloatFieldUpdateOperationsInput | number | null
    vision_right_od?: NullableStringFieldUpdateOperationsInput | string | null
    vision_left_os?: NullableStringFieldUpdateOperationsInput | string | null
    vision_corrected?: NullableStringFieldUpdateOperationsInput | string | null
    color_vision?: NullableStringFieldUpdateOperationsInput | string | null
    chief_complaint?: NullableStringFieldUpdateOperationsInput | string | null
    pcp_doctor?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalsCreateManyInput = {
    id?: number
    queue_id: number
    patient_id?: string | null
    bp_systolic?: number | null
    bp_diastolic?: number | null
    bp_systolic2?: number | null
    bp_diastolic2?: number | null
    bp_systolic3?: number | null
    bp_diastolic3?: number | null
    heart_rate?: number | null
    temperature?: number | null
    respiratory_rate?: number | null
    o2_saturation?: number | null
    weight_kg?: number | null
    height_cm?: number | null
    bmi?: number | null
    vision_right_od?: string | null
    vision_left_os?: string | null
    vision_corrected?: string | null
    color_vision?: string | null
    chief_complaint?: string | null
    pcp_doctor?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type VitalsUpdateManyMutationInput = {
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    bp_systolic?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic?: NullableIntFieldUpdateOperationsInput | number | null
    bp_systolic2?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic2?: NullableIntFieldUpdateOperationsInput | number | null
    bp_systolic3?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic3?: NullableIntFieldUpdateOperationsInput | number | null
    heart_rate?: NullableIntFieldUpdateOperationsInput | number | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    respiratory_rate?: NullableIntFieldUpdateOperationsInput | number | null
    o2_saturation?: NullableFloatFieldUpdateOperationsInput | number | null
    weight_kg?: NullableFloatFieldUpdateOperationsInput | number | null
    height_cm?: NullableFloatFieldUpdateOperationsInput | number | null
    bmi?: NullableFloatFieldUpdateOperationsInput | number | null
    vision_right_od?: NullableStringFieldUpdateOperationsInput | string | null
    vision_left_os?: NullableStringFieldUpdateOperationsInput | string | null
    vision_corrected?: NullableStringFieldUpdateOperationsInput | string | null
    color_vision?: NullableStringFieldUpdateOperationsInput | string | null
    chief_complaint?: NullableStringFieldUpdateOperationsInput | string | null
    pcp_doctor?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VitalsUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    bp_systolic?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic?: NullableIntFieldUpdateOperationsInput | number | null
    bp_systolic2?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic2?: NullableIntFieldUpdateOperationsInput | number | null
    bp_systolic3?: NullableIntFieldUpdateOperationsInput | number | null
    bp_diastolic3?: NullableIntFieldUpdateOperationsInput | number | null
    heart_rate?: NullableIntFieldUpdateOperationsInput | number | null
    temperature?: NullableFloatFieldUpdateOperationsInput | number | null
    respiratory_rate?: NullableIntFieldUpdateOperationsInput | number | null
    o2_saturation?: NullableFloatFieldUpdateOperationsInput | number | null
    weight_kg?: NullableFloatFieldUpdateOperationsInput | number | null
    height_cm?: NullableFloatFieldUpdateOperationsInput | number | null
    bmi?: NullableFloatFieldUpdateOperationsInput | number | null
    vision_right_od?: NullableStringFieldUpdateOperationsInput | string | null
    vision_left_os?: NullableStringFieldUpdateOperationsInput | string | null
    vision_corrected?: NullableStringFieldUpdateOperationsInput | string | null
    color_vision?: NullableStringFieldUpdateOperationsInput | string | null
    chief_complaint?: NullableStringFieldUpdateOperationsInput | string | null
    pcp_doctor?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhysicalExaminationCreateInput = {
    queue_id: number
    patient_id?: string | null
    hypertension?: boolean
    diabetes?: boolean
    asthma?: boolean
    heart_disease?: boolean
    thyroid_disease?: boolean
    kidney_disease?: boolean
    allergies?: boolean
    allergies_specify?: string | null
    surgery_history?: boolean
    surgery_specify?: string | null
    smoker?: boolean
    pack_years?: number | null
    alcoholic?: boolean
    lmp?: Date | string | null
    gravida?: number | null
    para?: number | null
    family_hypertension?: boolean
    family_diabetes?: boolean
    family_cancer?: boolean
    skin?: string | null
    heent?: string | null
    neck?: string | null
    chest_lungs?: string | null
    heart?: string | null
    abdomen?: string | null
    extremities?: string | null
    neurological?: string | null
    fitness_class?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PhysicalExaminationUncheckedCreateInput = {
    id?: number
    queue_id: number
    patient_id?: string | null
    hypertension?: boolean
    diabetes?: boolean
    asthma?: boolean
    heart_disease?: boolean
    thyroid_disease?: boolean
    kidney_disease?: boolean
    allergies?: boolean
    allergies_specify?: string | null
    surgery_history?: boolean
    surgery_specify?: string | null
    smoker?: boolean
    pack_years?: number | null
    alcoholic?: boolean
    lmp?: Date | string | null
    gravida?: number | null
    para?: number | null
    family_hypertension?: boolean
    family_diabetes?: boolean
    family_cancer?: boolean
    skin?: string | null
    heent?: string | null
    neck?: string | null
    chest_lungs?: string | null
    heart?: string | null
    abdomen?: string | null
    extremities?: string | null
    neurological?: string | null
    fitness_class?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PhysicalExaminationUpdateInput = {
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    hypertension?: BoolFieldUpdateOperationsInput | boolean
    diabetes?: BoolFieldUpdateOperationsInput | boolean
    asthma?: BoolFieldUpdateOperationsInput | boolean
    heart_disease?: BoolFieldUpdateOperationsInput | boolean
    thyroid_disease?: BoolFieldUpdateOperationsInput | boolean
    kidney_disease?: BoolFieldUpdateOperationsInput | boolean
    allergies?: BoolFieldUpdateOperationsInput | boolean
    allergies_specify?: NullableStringFieldUpdateOperationsInput | string | null
    surgery_history?: BoolFieldUpdateOperationsInput | boolean
    surgery_specify?: NullableStringFieldUpdateOperationsInput | string | null
    smoker?: BoolFieldUpdateOperationsInput | boolean
    pack_years?: NullableFloatFieldUpdateOperationsInput | number | null
    alcoholic?: BoolFieldUpdateOperationsInput | boolean
    lmp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gravida?: NullableIntFieldUpdateOperationsInput | number | null
    para?: NullableIntFieldUpdateOperationsInput | number | null
    family_hypertension?: BoolFieldUpdateOperationsInput | boolean
    family_diabetes?: BoolFieldUpdateOperationsInput | boolean
    family_cancer?: BoolFieldUpdateOperationsInput | boolean
    skin?: NullableStringFieldUpdateOperationsInput | string | null
    heent?: NullableStringFieldUpdateOperationsInput | string | null
    neck?: NullableStringFieldUpdateOperationsInput | string | null
    chest_lungs?: NullableStringFieldUpdateOperationsInput | string | null
    heart?: NullableStringFieldUpdateOperationsInput | string | null
    abdomen?: NullableStringFieldUpdateOperationsInput | string | null
    extremities?: NullableStringFieldUpdateOperationsInput | string | null
    neurological?: NullableStringFieldUpdateOperationsInput | string | null
    fitness_class?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhysicalExaminationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    hypertension?: BoolFieldUpdateOperationsInput | boolean
    diabetes?: BoolFieldUpdateOperationsInput | boolean
    asthma?: BoolFieldUpdateOperationsInput | boolean
    heart_disease?: BoolFieldUpdateOperationsInput | boolean
    thyroid_disease?: BoolFieldUpdateOperationsInput | boolean
    kidney_disease?: BoolFieldUpdateOperationsInput | boolean
    allergies?: BoolFieldUpdateOperationsInput | boolean
    allergies_specify?: NullableStringFieldUpdateOperationsInput | string | null
    surgery_history?: BoolFieldUpdateOperationsInput | boolean
    surgery_specify?: NullableStringFieldUpdateOperationsInput | string | null
    smoker?: BoolFieldUpdateOperationsInput | boolean
    pack_years?: NullableFloatFieldUpdateOperationsInput | number | null
    alcoholic?: BoolFieldUpdateOperationsInput | boolean
    lmp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gravida?: NullableIntFieldUpdateOperationsInput | number | null
    para?: NullableIntFieldUpdateOperationsInput | number | null
    family_hypertension?: BoolFieldUpdateOperationsInput | boolean
    family_diabetes?: BoolFieldUpdateOperationsInput | boolean
    family_cancer?: BoolFieldUpdateOperationsInput | boolean
    skin?: NullableStringFieldUpdateOperationsInput | string | null
    heent?: NullableStringFieldUpdateOperationsInput | string | null
    neck?: NullableStringFieldUpdateOperationsInput | string | null
    chest_lungs?: NullableStringFieldUpdateOperationsInput | string | null
    heart?: NullableStringFieldUpdateOperationsInput | string | null
    abdomen?: NullableStringFieldUpdateOperationsInput | string | null
    extremities?: NullableStringFieldUpdateOperationsInput | string | null
    neurological?: NullableStringFieldUpdateOperationsInput | string | null
    fitness_class?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhysicalExaminationCreateManyInput = {
    id?: number
    queue_id: number
    patient_id?: string | null
    hypertension?: boolean
    diabetes?: boolean
    asthma?: boolean
    heart_disease?: boolean
    thyroid_disease?: boolean
    kidney_disease?: boolean
    allergies?: boolean
    allergies_specify?: string | null
    surgery_history?: boolean
    surgery_specify?: string | null
    smoker?: boolean
    pack_years?: number | null
    alcoholic?: boolean
    lmp?: Date | string | null
    gravida?: number | null
    para?: number | null
    family_hypertension?: boolean
    family_diabetes?: boolean
    family_cancer?: boolean
    skin?: string | null
    heent?: string | null
    neck?: string | null
    chest_lungs?: string | null
    heart?: string | null
    abdomen?: string | null
    extremities?: string | null
    neurological?: string | null
    fitness_class?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PhysicalExaminationUpdateManyMutationInput = {
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    hypertension?: BoolFieldUpdateOperationsInput | boolean
    diabetes?: BoolFieldUpdateOperationsInput | boolean
    asthma?: BoolFieldUpdateOperationsInput | boolean
    heart_disease?: BoolFieldUpdateOperationsInput | boolean
    thyroid_disease?: BoolFieldUpdateOperationsInput | boolean
    kidney_disease?: BoolFieldUpdateOperationsInput | boolean
    allergies?: BoolFieldUpdateOperationsInput | boolean
    allergies_specify?: NullableStringFieldUpdateOperationsInput | string | null
    surgery_history?: BoolFieldUpdateOperationsInput | boolean
    surgery_specify?: NullableStringFieldUpdateOperationsInput | string | null
    smoker?: BoolFieldUpdateOperationsInput | boolean
    pack_years?: NullableFloatFieldUpdateOperationsInput | number | null
    alcoholic?: BoolFieldUpdateOperationsInput | boolean
    lmp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gravida?: NullableIntFieldUpdateOperationsInput | number | null
    para?: NullableIntFieldUpdateOperationsInput | number | null
    family_hypertension?: BoolFieldUpdateOperationsInput | boolean
    family_diabetes?: BoolFieldUpdateOperationsInput | boolean
    family_cancer?: BoolFieldUpdateOperationsInput | boolean
    skin?: NullableStringFieldUpdateOperationsInput | string | null
    heent?: NullableStringFieldUpdateOperationsInput | string | null
    neck?: NullableStringFieldUpdateOperationsInput | string | null
    chest_lungs?: NullableStringFieldUpdateOperationsInput | string | null
    heart?: NullableStringFieldUpdateOperationsInput | string | null
    abdomen?: NullableStringFieldUpdateOperationsInput | string | null
    extremities?: NullableStringFieldUpdateOperationsInput | string | null
    neurological?: NullableStringFieldUpdateOperationsInput | string | null
    fitness_class?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhysicalExaminationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    hypertension?: BoolFieldUpdateOperationsInput | boolean
    diabetes?: BoolFieldUpdateOperationsInput | boolean
    asthma?: BoolFieldUpdateOperationsInput | boolean
    heart_disease?: BoolFieldUpdateOperationsInput | boolean
    thyroid_disease?: BoolFieldUpdateOperationsInput | boolean
    kidney_disease?: BoolFieldUpdateOperationsInput | boolean
    allergies?: BoolFieldUpdateOperationsInput | boolean
    allergies_specify?: NullableStringFieldUpdateOperationsInput | string | null
    surgery_history?: BoolFieldUpdateOperationsInput | boolean
    surgery_specify?: NullableStringFieldUpdateOperationsInput | string | null
    smoker?: BoolFieldUpdateOperationsInput | boolean
    pack_years?: NullableFloatFieldUpdateOperationsInput | number | null
    alcoholic?: BoolFieldUpdateOperationsInput | boolean
    lmp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gravida?: NullableIntFieldUpdateOperationsInput | number | null
    para?: NullableIntFieldUpdateOperationsInput | number | null
    family_hypertension?: BoolFieldUpdateOperationsInput | boolean
    family_diabetes?: BoolFieldUpdateOperationsInput | boolean
    family_cancer?: BoolFieldUpdateOperationsInput | boolean
    skin?: NullableStringFieldUpdateOperationsInput | string | null
    heent?: NullableStringFieldUpdateOperationsInput | string | null
    neck?: NullableStringFieldUpdateOperationsInput | string | null
    chest_lungs?: NullableStringFieldUpdateOperationsInput | string | null
    heart?: NullableStringFieldUpdateOperationsInput | string | null
    abdomen?: NullableStringFieldUpdateOperationsInput | string | null
    extremities?: NullableStringFieldUpdateOperationsInput | string | null
    neurological?: NullableStringFieldUpdateOperationsInput | string | null
    fitness_class?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicalEvaluationCreateInput = {
    queue_id: number
    patient_id: string
    item_code: string
    item_name?: string | null
    findings?: string | null
    assessment?: string | null
    recommendation?: string | null
    class_value?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MedicalEvaluationUncheckedCreateInput = {
    id?: number
    queue_id: number
    patient_id: string
    item_code: string
    item_name?: string | null
    findings?: string | null
    assessment?: string | null
    recommendation?: string | null
    class_value?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MedicalEvaluationUpdateInput = {
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: NullableStringFieldUpdateOperationsInput | string | null
    assessment?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    class_value?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicalEvaluationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: NullableStringFieldUpdateOperationsInput | string | null
    assessment?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    class_value?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicalEvaluationCreateManyInput = {
    id?: number
    queue_id: number
    patient_id: string
    item_code: string
    item_name?: string | null
    findings?: string | null
    assessment?: string | null
    recommendation?: string | null
    class_value?: string | null
    recorded_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type MedicalEvaluationUpdateManyMutationInput = {
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: NullableStringFieldUpdateOperationsInput | string | null
    assessment?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    class_value?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MedicalEvaluationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    queue_id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: NullableStringFieldUpdateOperationsInput | string | null
    findings?: NullableStringFieldUpdateOperationsInput | string | null
    assessment?: NullableStringFieldUpdateOperationsInput | string | null
    recommendation?: NullableStringFieldUpdateOperationsInput | string | null
    class_value?: NullableStringFieldUpdateOperationsInput | string | null
    recorded_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    permissions?: SortOrder
    activated?: SortOrder
    created_by?: SortOrder
    activation_code?: SortOrder
    activated_at?: SortOrder
    last_login?: SortOrder
    persist_code?: SortOrder
    reset_password_code?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    website?: SortOrder
    country?: SortOrder
    gravatar?: SortOrder
    location_id?: SortOrder
    phone?: SortOrder
    jobtitle?: SortOrder
    manager_id?: SortOrder
    employee_num?: SortOrder
    avatar?: SortOrder
    username?: SortOrder
    notes?: SortOrder
    company_id?: SortOrder
    remember_token?: SortOrder
    ldap_import?: SortOrder
    locale?: SortOrder
    show_in_list?: SortOrder
    two_factor_secret?: SortOrder
    two_factor_enrolled?: SortOrder
    two_factor_optin?: SortOrder
    department_id?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip?: SortOrder
    skin?: SortOrder
    remote?: SortOrder
    status?: SortOrder
    role?: SortOrder
    department?: SortOrder
    accessmapid?: SortOrder
    ldap_server_status?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    created_by?: SortOrder
    location_id?: SortOrder
    manager_id?: SortOrder
    company_id?: SortOrder
    department_id?: SortOrder
    remote?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    permissions?: SortOrder
    activated?: SortOrder
    created_by?: SortOrder
    activation_code?: SortOrder
    activated_at?: SortOrder
    last_login?: SortOrder
    persist_code?: SortOrder
    reset_password_code?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    website?: SortOrder
    country?: SortOrder
    gravatar?: SortOrder
    location_id?: SortOrder
    phone?: SortOrder
    jobtitle?: SortOrder
    manager_id?: SortOrder
    employee_num?: SortOrder
    avatar?: SortOrder
    username?: SortOrder
    notes?: SortOrder
    company_id?: SortOrder
    remember_token?: SortOrder
    ldap_import?: SortOrder
    locale?: SortOrder
    show_in_list?: SortOrder
    two_factor_secret?: SortOrder
    two_factor_enrolled?: SortOrder
    two_factor_optin?: SortOrder
    department_id?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip?: SortOrder
    skin?: SortOrder
    remote?: SortOrder
    status?: SortOrder
    role?: SortOrder
    department?: SortOrder
    accessmapid?: SortOrder
    ldap_server_status?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password?: SortOrder
    permissions?: SortOrder
    activated?: SortOrder
    created_by?: SortOrder
    activation_code?: SortOrder
    activated_at?: SortOrder
    last_login?: SortOrder
    persist_code?: SortOrder
    reset_password_code?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    deleted_at?: SortOrder
    website?: SortOrder
    country?: SortOrder
    gravatar?: SortOrder
    location_id?: SortOrder
    phone?: SortOrder
    jobtitle?: SortOrder
    manager_id?: SortOrder
    employee_num?: SortOrder
    avatar?: SortOrder
    username?: SortOrder
    notes?: SortOrder
    company_id?: SortOrder
    remember_token?: SortOrder
    ldap_import?: SortOrder
    locale?: SortOrder
    show_in_list?: SortOrder
    two_factor_secret?: SortOrder
    two_factor_enrolled?: SortOrder
    two_factor_optin?: SortOrder
    department_id?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip?: SortOrder
    skin?: SortOrder
    remote?: SortOrder
    status?: SortOrder
    role?: SortOrder
    department?: SortOrder
    accessmapid?: SortOrder
    ldap_server_status?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    created_by?: SortOrder
    location_id?: SortOrder
    manager_id?: SortOrder
    company_id?: SortOrder
    department_id?: SortOrder
    remote?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type QueueCountOrderByAggregateInput = {
    id?: SortOrder
    idbu?: SortOrder
    code?: SortOrder
    Date?: SortOrder
    antedatequeueid?: SortOrder
    antedate?: SortOrder
    antedatecode?: SortOrder
    antedatetime?: SortOrder
    antedatestatus?: SortOrder
    antedatereason?: SortOrder
    antedateapprovedby?: SortOrder
    antedateapproveddate?: SortOrder
    datetime?: SortOrder
    idpatient?: SortOrder
    qfullname?: SortOrder
    qlastname?: SortOrder
    qfirstname?: SortOrder
    qmiddlename?: SortOrder
    qgender?: SortOrder
    qdob?: SortOrder
    qfulladdress?: SortOrder
    agepatient?: SortOrder
    status?: SortOrder
    accessionno?: SortOrder
    notes?: SortOrder
    cancelreason?: SortOrder
    patienttype?: SortOrder
    picture?: SortOrder
    inputby?: SortOrder
    lab2labid?: SortOrder
    labbarcode?: SortOrder
    labid?: SortOrder
    updatedate?: SortOrder
    updateby?: SortOrder
    erosstatus?: SortOrder
    systemupdatetime?: SortOrder
  }

  export type QueueAvgOrderByAggregateInput = {
    id?: SortOrder
    antedatequeueid?: SortOrder
    antedatestatus?: SortOrder
    idpatient?: SortOrder
    agepatient?: SortOrder
    status?: SortOrder
  }

  export type QueueMaxOrderByAggregateInput = {
    id?: SortOrder
    idbu?: SortOrder
    code?: SortOrder
    Date?: SortOrder
    antedatequeueid?: SortOrder
    antedate?: SortOrder
    antedatecode?: SortOrder
    antedatetime?: SortOrder
    antedatestatus?: SortOrder
    antedatereason?: SortOrder
    antedateapprovedby?: SortOrder
    antedateapproveddate?: SortOrder
    datetime?: SortOrder
    idpatient?: SortOrder
    qfullname?: SortOrder
    qlastname?: SortOrder
    qfirstname?: SortOrder
    qmiddlename?: SortOrder
    qgender?: SortOrder
    qdob?: SortOrder
    qfulladdress?: SortOrder
    agepatient?: SortOrder
    status?: SortOrder
    accessionno?: SortOrder
    notes?: SortOrder
    cancelreason?: SortOrder
    patienttype?: SortOrder
    picture?: SortOrder
    inputby?: SortOrder
    lab2labid?: SortOrder
    labbarcode?: SortOrder
    labid?: SortOrder
    updatedate?: SortOrder
    updateby?: SortOrder
    erosstatus?: SortOrder
    systemupdatetime?: SortOrder
  }

  export type QueueMinOrderByAggregateInput = {
    id?: SortOrder
    idbu?: SortOrder
    code?: SortOrder
    Date?: SortOrder
    antedatequeueid?: SortOrder
    antedate?: SortOrder
    antedatecode?: SortOrder
    antedatetime?: SortOrder
    antedatestatus?: SortOrder
    antedatereason?: SortOrder
    antedateapprovedby?: SortOrder
    antedateapproveddate?: SortOrder
    datetime?: SortOrder
    idpatient?: SortOrder
    qfullname?: SortOrder
    qlastname?: SortOrder
    qfirstname?: SortOrder
    qmiddlename?: SortOrder
    qgender?: SortOrder
    qdob?: SortOrder
    qfulladdress?: SortOrder
    agepatient?: SortOrder
    status?: SortOrder
    accessionno?: SortOrder
    notes?: SortOrder
    cancelreason?: SortOrder
    patienttype?: SortOrder
    picture?: SortOrder
    inputby?: SortOrder
    lab2labid?: SortOrder
    labbarcode?: SortOrder
    labid?: SortOrder
    updatedate?: SortOrder
    updateby?: SortOrder
    erosstatus?: SortOrder
    systemupdatetime?: SortOrder
  }

  export type QueueSumOrderByAggregateInput = {
    id?: SortOrder
    antedatequeueid?: SortOrder
    antedatestatus?: SortOrder
    idpatient?: SortOrder
    agepatient?: SortOrder
    status?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type CmsVitalsCountOrderByAggregateInput = {
    id?: SortOrder
    idqueue?: SortOrder
    medication?: SortOrder
    lastdose?: SortOrder
    lastperiod?: SortOrder
    inputby?: SortOrder
    inputdatetime?: SortOrder
  }

  export type CmsVitalsAvgOrderByAggregateInput = {
    id?: SortOrder
    idqueue?: SortOrder
  }

  export type CmsVitalsMaxOrderByAggregateInput = {
    id?: SortOrder
    idqueue?: SortOrder
    medication?: SortOrder
    lastdose?: SortOrder
    lastperiod?: SortOrder
    inputby?: SortOrder
    inputdatetime?: SortOrder
  }

  export type CmsVitalsMinOrderByAggregateInput = {
    id?: SortOrder
    idqueue?: SortOrder
    medication?: SortOrder
    lastdose?: SortOrder
    lastperiod?: SortOrder
    inputby?: SortOrder
    inputdatetime?: SortOrder
  }

  export type CmsVitalsSumOrderByAggregateInput = {
    id?: SortOrder
    idqueue?: SortOrder
  }

  export type PatientCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    fullname?: SortOrder
    lastname?: SortOrder
    firstname?: SortOrder
    middlename?: SortOrder
    suffix?: SortOrder
    prefix?: SortOrder
    gender?: SortOrder
    dob?: SortOrder
    email?: SortOrder
    fulladdress?: SortOrder
    address?: SortOrder
    barangay?: SortOrder
    barangayname?: SortOrder
    city?: SortOrder
    cityname?: SortOrder
    state?: SortOrder
    zipcode?: SortOrder
    nationality?: SortOrder
    country?: SortOrder
    religion?: SortOrder
    contactno?: SortOrder
    moblie?: SortOrder
    faxno?: SortOrder
    philhealth?: SortOrder
    seniorid?: SortOrder
    pwd?: SortOrder
    expirydatepwd?: SortOrder
    status?: SortOrder
    isactive?: SortOrder
    remarks?: SortOrder
    picturelink?: SortOrder
    uploadid?: SortOrder
    inputdate?: SortOrder
    inputby?: SortOrder
    updatedate?: SortOrder
    updateby?: SortOrder
    lastvisit?: SortOrder
    passportno?: SortOrder
    employeeid?: SortOrder
    rdob?: SortOrder
    uploaddatetime?: SortOrder
  }

  export type PatientAvgOrderByAggregateInput = {
    id?: SortOrder
    isactive?: SortOrder
  }

  export type PatientMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    fullname?: SortOrder
    lastname?: SortOrder
    firstname?: SortOrder
    middlename?: SortOrder
    suffix?: SortOrder
    prefix?: SortOrder
    gender?: SortOrder
    dob?: SortOrder
    email?: SortOrder
    fulladdress?: SortOrder
    address?: SortOrder
    barangay?: SortOrder
    barangayname?: SortOrder
    city?: SortOrder
    cityname?: SortOrder
    state?: SortOrder
    zipcode?: SortOrder
    nationality?: SortOrder
    country?: SortOrder
    religion?: SortOrder
    contactno?: SortOrder
    moblie?: SortOrder
    faxno?: SortOrder
    philhealth?: SortOrder
    seniorid?: SortOrder
    pwd?: SortOrder
    expirydatepwd?: SortOrder
    status?: SortOrder
    isactive?: SortOrder
    remarks?: SortOrder
    picturelink?: SortOrder
    uploadid?: SortOrder
    inputdate?: SortOrder
    inputby?: SortOrder
    updatedate?: SortOrder
    updateby?: SortOrder
    lastvisit?: SortOrder
    passportno?: SortOrder
    employeeid?: SortOrder
    rdob?: SortOrder
    uploaddatetime?: SortOrder
  }

  export type PatientMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    fullname?: SortOrder
    lastname?: SortOrder
    firstname?: SortOrder
    middlename?: SortOrder
    suffix?: SortOrder
    prefix?: SortOrder
    gender?: SortOrder
    dob?: SortOrder
    email?: SortOrder
    fulladdress?: SortOrder
    address?: SortOrder
    barangay?: SortOrder
    barangayname?: SortOrder
    city?: SortOrder
    cityname?: SortOrder
    state?: SortOrder
    zipcode?: SortOrder
    nationality?: SortOrder
    country?: SortOrder
    religion?: SortOrder
    contactno?: SortOrder
    moblie?: SortOrder
    faxno?: SortOrder
    philhealth?: SortOrder
    seniorid?: SortOrder
    pwd?: SortOrder
    expirydatepwd?: SortOrder
    status?: SortOrder
    isactive?: SortOrder
    remarks?: SortOrder
    picturelink?: SortOrder
    uploadid?: SortOrder
    inputdate?: SortOrder
    inputby?: SortOrder
    updatedate?: SortOrder
    updateby?: SortOrder
    lastvisit?: SortOrder
    passportno?: SortOrder
    employeeid?: SortOrder
    rdob?: SortOrder
    uploaddatetime?: SortOrder
  }

  export type PatientSumOrderByAggregateInput = {
    id?: SortOrder
    isactive?: SortOrder
  }

  export type CardEnrollmentCountOrderByAggregateInput = {
    id?: SortOrder
    cardnumber?: SortOrder
    dateenrolled?: SortOrder
    receivedby?: SortOrder
    receiveddate?: SortOrder
    releaseto?: SortOrder
    oldreleaseto?: SortOrder
    releaseby?: SortOrder
    daterelease?: SortOrder
    transferto?: SortOrder
    datetransfer?: SortOrder
    transferby?: SortOrder
    status?: SortOrder
  }

  export type CardEnrollmentAvgOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type CardEnrollmentMaxOrderByAggregateInput = {
    id?: SortOrder
    cardnumber?: SortOrder
    dateenrolled?: SortOrder
    receivedby?: SortOrder
    receiveddate?: SortOrder
    releaseto?: SortOrder
    oldreleaseto?: SortOrder
    releaseby?: SortOrder
    daterelease?: SortOrder
    transferto?: SortOrder
    datetransfer?: SortOrder
    transferby?: SortOrder
    status?: SortOrder
  }

  export type CardEnrollmentMinOrderByAggregateInput = {
    id?: SortOrder
    cardnumber?: SortOrder
    dateenrolled?: SortOrder
    receivedby?: SortOrder
    receiveddate?: SortOrder
    releaseto?: SortOrder
    oldreleaseto?: SortOrder
    releaseby?: SortOrder
    daterelease?: SortOrder
    transferto?: SortOrder
    datetransfer?: SortOrder
    transferby?: SortOrder
    status?: SortOrder
  }

  export type CardEnrollmentSumOrderByAggregateInput = {
    id?: SortOrder
    status?: SortOrder
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type CardNumberCountOrderByAggregateInput = {
    id?: SortOrder
    year?: SortOrder
    batch?: SortOrder
    month?: SortOrder
    seriesnum?: SortOrder
    maskedseries?: SortOrder
    generatedcardnumber?: SortOrder
    codecompany?: SortOrder
    generatedby?: SortOrder
  }

  export type CardNumberAvgOrderByAggregateInput = {
    id?: SortOrder
    year?: SortOrder
    batch?: SortOrder
    month?: SortOrder
    seriesnum?: SortOrder
  }

  export type CardNumberMaxOrderByAggregateInput = {
    id?: SortOrder
    year?: SortOrder
    batch?: SortOrder
    month?: SortOrder
    seriesnum?: SortOrder
    maskedseries?: SortOrder
    generatedcardnumber?: SortOrder
    codecompany?: SortOrder
    generatedby?: SortOrder
  }

  export type CardNumberMinOrderByAggregateInput = {
    id?: SortOrder
    year?: SortOrder
    batch?: SortOrder
    month?: SortOrder
    seriesnum?: SortOrder
    maskedseries?: SortOrder
    generatedcardnumber?: SortOrder
    codecompany?: SortOrder
    generatedby?: SortOrder
  }

  export type CardNumberSumOrderByAggregateInput = {
    id?: SortOrder
    year?: SortOrder
    batch?: SortOrder
    month?: SortOrder
    seriesnum?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type CardVerifiedCountOrderByAggregateInput = {
    id?: SortOrder
    verifiedcardnumbers?: SortOrder
    ictreceived?: SortOrder
    datereceived?: SortOrder
  }

  export type CardVerifiedAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CardVerifiedMaxOrderByAggregateInput = {
    id?: SortOrder
    verifiedcardnumbers?: SortOrder
    ictreceived?: SortOrder
    datereceived?: SortOrder
  }

  export type CardVerifiedMinOrderByAggregateInput = {
    id?: SortOrder
    verifiedcardnumbers?: SortOrder
    ictreceived?: SortOrder
    datereceived?: SortOrder
  }

  export type CardVerifiedSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CmsCompanyCountOrderByAggregateInput = {
    id?: SortOrder
    server?: SortOrder
    idcompany?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    billingtype?: SortOrder
  }

  export type CmsCompanyAvgOrderByAggregateInput = {
    id?: SortOrder
    idcompany?: SortOrder
  }

  export type CmsCompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    server?: SortOrder
    idcompany?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    billingtype?: SortOrder
  }

  export type CmsCompanyMinOrderByAggregateInput = {
    id?: SortOrder
    server?: SortOrder
    idcompany?: SortOrder
    code?: SortOrder
    name?: SortOrder
    status?: SortOrder
    billingtype?: SortOrder
  }

  export type CmsCompanySumOrderByAggregateInput = {
    id?: SortOrder
    idcompany?: SortOrder
  }

  export type ConsultationNoteCountOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    status?: SortOrder
    is_draft?: SortOrder
    chief_complaint?: SortOrder
    history_illness?: SortOrder
    past_history?: SortOrder
    family_history?: SortOrder
    pe_findings?: SortOrder
    diagnosis?: SortOrder
    icd_code?: SortOrder
    treatment_plan?: SortOrder
    orders?: SortOrder
    pcp_doctor?: SortOrder
    doctor_id?: SortOrder
    doctor_name?: SortOrder
    recorded_by?: SortOrder
    completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ConsultationNoteAvgOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    is_draft?: SortOrder
    doctor_id?: SortOrder
    recorded_by?: SortOrder
  }

  export type ConsultationNoteMaxOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    status?: SortOrder
    is_draft?: SortOrder
    chief_complaint?: SortOrder
    history_illness?: SortOrder
    past_history?: SortOrder
    family_history?: SortOrder
    pe_findings?: SortOrder
    diagnosis?: SortOrder
    icd_code?: SortOrder
    treatment_plan?: SortOrder
    orders?: SortOrder
    pcp_doctor?: SortOrder
    doctor_id?: SortOrder
    doctor_name?: SortOrder
    recorded_by?: SortOrder
    completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ConsultationNoteMinOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    status?: SortOrder
    is_draft?: SortOrder
    chief_complaint?: SortOrder
    history_illness?: SortOrder
    past_history?: SortOrder
    family_history?: SortOrder
    pe_findings?: SortOrder
    diagnosis?: SortOrder
    icd_code?: SortOrder
    treatment_plan?: SortOrder
    orders?: SortOrder
    pcp_doctor?: SortOrder
    doctor_id?: SortOrder
    doctor_name?: SortOrder
    recorded_by?: SortOrder
    completed_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ConsultationNoteSumOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    is_draft?: SortOrder
    doctor_id?: SortOrder
    recorded_by?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type VitalsCountOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    bp_systolic?: SortOrder
    bp_diastolic?: SortOrder
    bp_systolic2?: SortOrder
    bp_diastolic2?: SortOrder
    bp_systolic3?: SortOrder
    bp_diastolic3?: SortOrder
    heart_rate?: SortOrder
    temperature?: SortOrder
    respiratory_rate?: SortOrder
    o2_saturation?: SortOrder
    weight_kg?: SortOrder
    height_cm?: SortOrder
    bmi?: SortOrder
    vision_right_od?: SortOrder
    vision_left_os?: SortOrder
    vision_corrected?: SortOrder
    color_vision?: SortOrder
    chief_complaint?: SortOrder
    pcp_doctor?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type VitalsAvgOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    bp_systolic?: SortOrder
    bp_diastolic?: SortOrder
    bp_systolic2?: SortOrder
    bp_diastolic2?: SortOrder
    bp_systolic3?: SortOrder
    bp_diastolic3?: SortOrder
    heart_rate?: SortOrder
    temperature?: SortOrder
    respiratory_rate?: SortOrder
    o2_saturation?: SortOrder
    weight_kg?: SortOrder
    height_cm?: SortOrder
    bmi?: SortOrder
    recorded_by?: SortOrder
  }

  export type VitalsMaxOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    bp_systolic?: SortOrder
    bp_diastolic?: SortOrder
    bp_systolic2?: SortOrder
    bp_diastolic2?: SortOrder
    bp_systolic3?: SortOrder
    bp_diastolic3?: SortOrder
    heart_rate?: SortOrder
    temperature?: SortOrder
    respiratory_rate?: SortOrder
    o2_saturation?: SortOrder
    weight_kg?: SortOrder
    height_cm?: SortOrder
    bmi?: SortOrder
    vision_right_od?: SortOrder
    vision_left_os?: SortOrder
    vision_corrected?: SortOrder
    color_vision?: SortOrder
    chief_complaint?: SortOrder
    pcp_doctor?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type VitalsMinOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    bp_systolic?: SortOrder
    bp_diastolic?: SortOrder
    bp_systolic2?: SortOrder
    bp_diastolic2?: SortOrder
    bp_systolic3?: SortOrder
    bp_diastolic3?: SortOrder
    heart_rate?: SortOrder
    temperature?: SortOrder
    respiratory_rate?: SortOrder
    o2_saturation?: SortOrder
    weight_kg?: SortOrder
    height_cm?: SortOrder
    bmi?: SortOrder
    vision_right_od?: SortOrder
    vision_left_os?: SortOrder
    vision_corrected?: SortOrder
    color_vision?: SortOrder
    chief_complaint?: SortOrder
    pcp_doctor?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type VitalsSumOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    bp_systolic?: SortOrder
    bp_diastolic?: SortOrder
    bp_systolic2?: SortOrder
    bp_diastolic2?: SortOrder
    bp_systolic3?: SortOrder
    bp_diastolic3?: SortOrder
    heart_rate?: SortOrder
    temperature?: SortOrder
    respiratory_rate?: SortOrder
    o2_saturation?: SortOrder
    weight_kg?: SortOrder
    height_cm?: SortOrder
    bmi?: SortOrder
    recorded_by?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type PhysicalExaminationCountOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    hypertension?: SortOrder
    diabetes?: SortOrder
    asthma?: SortOrder
    heart_disease?: SortOrder
    thyroid_disease?: SortOrder
    kidney_disease?: SortOrder
    allergies?: SortOrder
    allergies_specify?: SortOrder
    surgery_history?: SortOrder
    surgery_specify?: SortOrder
    smoker?: SortOrder
    pack_years?: SortOrder
    alcoholic?: SortOrder
    lmp?: SortOrder
    gravida?: SortOrder
    para?: SortOrder
    family_hypertension?: SortOrder
    family_diabetes?: SortOrder
    family_cancer?: SortOrder
    skin?: SortOrder
    heent?: SortOrder
    neck?: SortOrder
    chest_lungs?: SortOrder
    heart?: SortOrder
    abdomen?: SortOrder
    extremities?: SortOrder
    neurological?: SortOrder
    fitness_class?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PhysicalExaminationAvgOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    pack_years?: SortOrder
    gravida?: SortOrder
    para?: SortOrder
    recorded_by?: SortOrder
  }

  export type PhysicalExaminationMaxOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    hypertension?: SortOrder
    diabetes?: SortOrder
    asthma?: SortOrder
    heart_disease?: SortOrder
    thyroid_disease?: SortOrder
    kidney_disease?: SortOrder
    allergies?: SortOrder
    allergies_specify?: SortOrder
    surgery_history?: SortOrder
    surgery_specify?: SortOrder
    smoker?: SortOrder
    pack_years?: SortOrder
    alcoholic?: SortOrder
    lmp?: SortOrder
    gravida?: SortOrder
    para?: SortOrder
    family_hypertension?: SortOrder
    family_diabetes?: SortOrder
    family_cancer?: SortOrder
    skin?: SortOrder
    heent?: SortOrder
    neck?: SortOrder
    chest_lungs?: SortOrder
    heart?: SortOrder
    abdomen?: SortOrder
    extremities?: SortOrder
    neurological?: SortOrder
    fitness_class?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PhysicalExaminationMinOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    hypertension?: SortOrder
    diabetes?: SortOrder
    asthma?: SortOrder
    heart_disease?: SortOrder
    thyroid_disease?: SortOrder
    kidney_disease?: SortOrder
    allergies?: SortOrder
    allergies_specify?: SortOrder
    surgery_history?: SortOrder
    surgery_specify?: SortOrder
    smoker?: SortOrder
    pack_years?: SortOrder
    alcoholic?: SortOrder
    lmp?: SortOrder
    gravida?: SortOrder
    para?: SortOrder
    family_hypertension?: SortOrder
    family_diabetes?: SortOrder
    family_cancer?: SortOrder
    skin?: SortOrder
    heent?: SortOrder
    neck?: SortOrder
    chest_lungs?: SortOrder
    heart?: SortOrder
    abdomen?: SortOrder
    extremities?: SortOrder
    neurological?: SortOrder
    fitness_class?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PhysicalExaminationSumOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    pack_years?: SortOrder
    gravida?: SortOrder
    para?: SortOrder
    recorded_by?: SortOrder
  }

  export type MedicalEvaluationQueue_idItem_codeCompoundUniqueInput = {
    queue_id: number
    item_code: string
  }

  export type MedicalEvaluationCountOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrder
    findings?: SortOrder
    assessment?: SortOrder
    recommendation?: SortOrder
    class_value?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MedicalEvaluationAvgOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    recorded_by?: SortOrder
  }

  export type MedicalEvaluationMaxOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrder
    findings?: SortOrder
    assessment?: SortOrder
    recommendation?: SortOrder
    class_value?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MedicalEvaluationMinOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    patient_id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrder
    findings?: SortOrder
    assessment?: SortOrder
    recommendation?: SortOrder
    class_value?: SortOrder
    recorded_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type MedicalEvaluationSumOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    recorded_by?: SortOrder
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableBigIntFieldUpdateOperationsInput = {
    set?: bigint | number | null
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBigIntNullableFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableFilter<$PrismaModel> | bigint | number | null
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBigIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel> | null
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel> | null
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntNullableWithAggregatesFilter<$PrismaModel> | bigint | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedBigIntNullableFilter<$PrismaModel>
    _min?: NestedBigIntNullableFilter<$PrismaModel>
    _max?: NestedBigIntNullableFilter<$PrismaModel>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}