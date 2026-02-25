
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
 * Model PaymentHistory
 * 
 */
export type PaymentHistory = $Result.DefaultSelection<Prisma.$PaymentHistoryPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model ItemMaster
 * 
 */
export type ItemMaster = $Result.DefaultSelection<Prisma.$ItemMasterPayload>
/**
 * Model ItemPrice
 * 
 */
export type ItemPrice = $Result.DefaultSelection<Prisma.$ItemPricePayload>
/**
 * Model Physician
 * 
 */
export type Physician = $Result.DefaultSelection<Prisma.$PhysicianPayload>
/**
 * Model HL7Message
 * 
 */
export type HL7Message = $Result.DefaultSelection<Prisma.$HL7MessagePayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Setting
 * 
 */
export type Setting = $Result.DefaultSelection<Prisma.$SettingPayload>

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
   * `prisma.paymentHistory`: Exposes CRUD operations for the **PaymentHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentHistories
    * const paymentHistories = await prisma.paymentHistory.findMany()
    * ```
    */
  get paymentHistory(): Prisma.PaymentHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.itemMaster`: Exposes CRUD operations for the **ItemMaster** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ItemMasters
    * const itemMasters = await prisma.itemMaster.findMany()
    * ```
    */
  get itemMaster(): Prisma.ItemMasterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.itemPrice`: Exposes CRUD operations for the **ItemPrice** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ItemPrices
    * const itemPrices = await prisma.itemPrice.findMany()
    * ```
    */
  get itemPrice(): Prisma.ItemPriceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.physician`: Exposes CRUD operations for the **Physician** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Physicians
    * const physicians = await prisma.physician.findMany()
    * ```
    */
  get physician(): Prisma.PhysicianDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hL7Message`: Exposes CRUD operations for the **HL7Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more HL7Messages
    * const hL7Messages = await prisma.hL7Message.findMany()
    * ```
    */
  get hL7Message(): Prisma.HL7MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.setting`: Exposes CRUD operations for the **Setting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.setting.findMany()
    * ```
    */
  get setting(): Prisma.SettingDelegate<ExtArgs, ClientOptions>;
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
    CardEnrollment: 'CardEnrollment',
    CardNumber: 'CardNumber',
    PaymentHistory: 'PaymentHistory',
    Transaction: 'Transaction',
    Company: 'Company',
    ItemMaster: 'ItemMaster',
    ItemPrice: 'ItemPrice',
    Physician: 'Physician',
    HL7Message: 'HL7Message',
    Role: 'Role',
    Setting: 'Setting'
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
      modelProps: "user" | "queue" | "cardEnrollment" | "cardNumber" | "paymentHistory" | "transaction" | "company" | "itemMaster" | "itemPrice" | "physician" | "hL7Message" | "role" | "setting"
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
      PaymentHistory: {
        payload: Prisma.$PaymentHistoryPayload<ExtArgs>
        fields: Prisma.PaymentHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload>
          }
          findFirst: {
            args: Prisma.PaymentHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload>
          }
          findMany: {
            args: Prisma.PaymentHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload>[]
          }
          create: {
            args: Prisma.PaymentHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload>
          }
          createMany: {
            args: Prisma.PaymentHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PaymentHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload>
          }
          update: {
            args: Prisma.PaymentHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload>
          }
          deleteMany: {
            args: Prisma.PaymentHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PaymentHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PaymentHistoryPayload>
          }
          aggregate: {
            args: Prisma.PaymentHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePaymentHistory>
          }
          groupBy: {
            args: Prisma.PaymentHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<PaymentHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<PaymentHistoryCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      ItemMaster: {
        payload: Prisma.$ItemMasterPayload<ExtArgs>
        fields: Prisma.ItemMasterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemMasterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemMasterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload>
          }
          findFirst: {
            args: Prisma.ItemMasterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemMasterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload>
          }
          findMany: {
            args: Prisma.ItemMasterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload>[]
          }
          create: {
            args: Prisma.ItemMasterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload>
          }
          createMany: {
            args: Prisma.ItemMasterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ItemMasterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload>
          }
          update: {
            args: Prisma.ItemMasterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload>
          }
          deleteMany: {
            args: Prisma.ItemMasterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemMasterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemMasterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemMasterPayload>
          }
          aggregate: {
            args: Prisma.ItemMasterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItemMaster>
          }
          groupBy: {
            args: Prisma.ItemMasterGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemMasterGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemMasterCountArgs<ExtArgs>
            result: $Utils.Optional<ItemMasterCountAggregateOutputType> | number
          }
        }
      }
      ItemPrice: {
        payload: Prisma.$ItemPricePayload<ExtArgs>
        fields: Prisma.ItemPriceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ItemPriceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ItemPriceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload>
          }
          findFirst: {
            args: Prisma.ItemPriceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ItemPriceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload>
          }
          findMany: {
            args: Prisma.ItemPriceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload>[]
          }
          create: {
            args: Prisma.ItemPriceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload>
          }
          createMany: {
            args: Prisma.ItemPriceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ItemPriceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload>
          }
          update: {
            args: Prisma.ItemPriceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload>
          }
          deleteMany: {
            args: Prisma.ItemPriceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ItemPriceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ItemPriceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ItemPricePayload>
          }
          aggregate: {
            args: Prisma.ItemPriceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateItemPrice>
          }
          groupBy: {
            args: Prisma.ItemPriceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ItemPriceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ItemPriceCountArgs<ExtArgs>
            result: $Utils.Optional<ItemPriceCountAggregateOutputType> | number
          }
        }
      }
      Physician: {
        payload: Prisma.$PhysicianPayload<ExtArgs>
        fields: Prisma.PhysicianFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhysicianFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhysicianFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload>
          }
          findFirst: {
            args: Prisma.PhysicianFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhysicianFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload>
          }
          findMany: {
            args: Prisma.PhysicianFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload>[]
          }
          create: {
            args: Prisma.PhysicianCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload>
          }
          createMany: {
            args: Prisma.PhysicianCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.PhysicianDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload>
          }
          update: {
            args: Prisma.PhysicianUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload>
          }
          deleteMany: {
            args: Prisma.PhysicianDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhysicianUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PhysicianUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhysicianPayload>
          }
          aggregate: {
            args: Prisma.PhysicianAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhysician>
          }
          groupBy: {
            args: Prisma.PhysicianGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhysicianGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhysicianCountArgs<ExtArgs>
            result: $Utils.Optional<PhysicianCountAggregateOutputType> | number
          }
        }
      }
      HL7Message: {
        payload: Prisma.$HL7MessagePayload<ExtArgs>
        fields: Prisma.HL7MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HL7MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HL7MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload>
          }
          findFirst: {
            args: Prisma.HL7MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HL7MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload>
          }
          findMany: {
            args: Prisma.HL7MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload>[]
          }
          create: {
            args: Prisma.HL7MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload>
          }
          createMany: {
            args: Prisma.HL7MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.HL7MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload>
          }
          update: {
            args: Prisma.HL7MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload>
          }
          deleteMany: {
            args: Prisma.HL7MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HL7MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.HL7MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HL7MessagePayload>
          }
          aggregate: {
            args: Prisma.HL7MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHL7Message>
          }
          groupBy: {
            args: Prisma.HL7MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<HL7MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.HL7MessageCountArgs<ExtArgs>
            result: $Utils.Optional<HL7MessageCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Setting: {
        payload: Prisma.$SettingPayload<ExtArgs>
        fields: Prisma.SettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findFirst: {
            args: Prisma.SettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findMany: {
            args: Prisma.SettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          create: {
            args: Prisma.SettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          createMany: {
            args: Prisma.SettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          update: {
            args: Prisma.SettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          deleteMany: {
            args: Prisma.SettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          aggregate: {
            args: Prisma.SettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSetting>
          }
          groupBy: {
            args: Prisma.SettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingCountArgs<ExtArgs>
            result: $Utils.Optional<SettingCountAggregateOutputType> | number
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
    cardEnrollment?: CardEnrollmentOmit
    cardNumber?: CardNumberOmit
    paymentHistory?: PaymentHistoryOmit
    transaction?: TransactionOmit
    company?: CompanyOmit
    itemMaster?: ItemMasterOmit
    itemPrice?: ItemPriceOmit
    physician?: PhysicianOmit
    hL7Message?: HL7MessageOmit
    role?: RoleOmit
    setting?: SettingOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    queues: number
    payments: number
    transactions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    queues?: boolean | UserCountOutputTypeCountQueuesArgs
    payments?: boolean | UserCountOutputTypeCountPaymentsArgs
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountQueuesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: QueueWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentHistoryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type QueueCountOutputType
   */

  export type QueueCountOutputType = {
    payments: number
  }

  export type QueueCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    payments?: boolean | QueueCountOutputTypeCountPaymentsArgs
  }

  // Custom InputTypes
  /**
   * QueueCountOutputType without action
   */
  export type QueueCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the QueueCountOutputType
     */
    select?: QueueCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * QueueCountOutputType without action
   */
  export type QueueCountOutputTypeCountPaymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentHistoryWhereInput
  }


  /**
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    items: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | CompanyCountOutputTypeCountItemsArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemPriceWhereInput
  }


  /**
   * Count Type ItemMasterCountOutputType
   */

  export type ItemMasterCountOutputType = {
    prices: number
  }

  export type ItemMasterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prices?: boolean | ItemMasterCountOutputTypeCountPricesArgs
  }

  // Custom InputTypes
  /**
   * ItemMasterCountOutputType without action
   */
  export type ItemMasterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMasterCountOutputType
     */
    select?: ItemMasterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ItemMasterCountOutputType without action
   */
  export type ItemMasterCountOutputTypeCountPricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemPriceWhereInput
  }


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
    activated: number | null
    ldap_import: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    activated: number | null
    ldap_import: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    username: string | null
    email: string | null
    password: string | null
    first_name: string | null
    last_name: string | null
    department: string | null
    role: string | null
    activated: number | null
    ldap_import: number | null
    deleted_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    username: string | null
    email: string | null
    password: string | null
    first_name: string | null
    last_name: string | null
    department: string | null
    role: string | null
    activated: number | null
    ldap_import: number | null
    deleted_at: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    email: number
    password: number
    first_name: number
    last_name: number
    department: number
    role: number
    activated: number
    ldap_import: number
    deleted_at: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    activated?: true
    ldap_import?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    activated?: true
    ldap_import?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    first_name?: true
    last_name?: true
    department?: true
    role?: true
    activated?: true
    ldap_import?: true
    deleted_at?: true
    created_at?: true
    updated_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    first_name?: true
    last_name?: true
    department?: true
    role?: true
    activated?: true
    ldap_import?: true
    deleted_at?: true
    created_at?: true
    updated_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    password?: true
    first_name?: true
    last_name?: true
    department?: true
    role?: true
    activated?: true
    ldap_import?: true
    deleted_at?: true
    created_at?: true
    updated_at?: true
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
    username: string
    email: string | null
    password: string
    first_name: string | null
    last_name: string | null
    department: string | null
    role: string | null
    activated: number
    ldap_import: number
    deleted_at: Date | null
    created_at: Date
    updated_at: Date
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
    username?: boolean
    email?: boolean
    password?: boolean
    first_name?: boolean
    last_name?: boolean
    department?: boolean
    role?: boolean
    activated?: boolean
    ldap_import?: boolean
    deleted_at?: boolean
    created_at?: boolean
    updated_at?: boolean
    queues?: boolean | User$queuesArgs<ExtArgs>
    payments?: boolean | User$paymentsArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    first_name?: boolean
    last_name?: boolean
    department?: boolean
    role?: boolean
    activated?: boolean
    ldap_import?: boolean
    deleted_at?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "email" | "password" | "first_name" | "last_name" | "department" | "role" | "activated" | "ldap_import" | "deleted_at" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    queues?: boolean | User$queuesArgs<ExtArgs>
    payments?: boolean | User$paymentsArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      queues: Prisma.$QueuePayload<ExtArgs>[]
      payments: Prisma.$PaymentHistoryPayload<ExtArgs>[]
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      email: string | null
      password: string
      first_name: string | null
      last_name: string | null
      department: string | null
      role: string | null
      activated: number
      ldap_import: number
      deleted_at: Date | null
      created_at: Date
      updated_at: Date
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
    queues<T extends User$queuesArgs<ExtArgs> = {}>(args?: Subset<T, User$queuesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    payments<T extends User$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, User$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transactions<T extends User$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly first_name: FieldRef<"User", 'String'>
    readonly last_name: FieldRef<"User", 'String'>
    readonly department: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly activated: FieldRef<"User", 'Int'>
    readonly ldap_import: FieldRef<"User", 'Int'>
    readonly deleted_at: FieldRef<"User", 'DateTime'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
   * User.queues
   */
  export type User$queuesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
    where?: QueueWhereInput
    orderBy?: QueueOrderByWithRelationInput | QueueOrderByWithRelationInput[]
    cursor?: QueueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: QueueScalarFieldEnum | QueueScalarFieldEnum[]
  }

  /**
   * User.payments
   */
  export type User$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    where?: PaymentHistoryWhereInput
    orderBy?: PaymentHistoryOrderByWithRelationInput | PaymentHistoryOrderByWithRelationInput[]
    cursor?: PaymentHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentHistoryScalarFieldEnum | PaymentHistoryScalarFieldEnum[]
  }

  /**
   * User.transactions
   */
  export type User$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
    queue_number: number | null
    priority: number | null
    created_by: number | null
  }

  export type QueueSumAggregateOutputType = {
    id: number | null
    queue_number: number | null
    priority: number | null
    created_by: number | null
  }

  export type QueueMinAggregateOutputType = {
    id: number | null
    patient_id: string | null
    patient_name: string | null
    company_code: string | null
    company_name: string | null
    queue_number: number | null
    status: string | null
    priority: number | null
    clinic_code: string | null
    created_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type QueueMaxAggregateOutputType = {
    id: number | null
    patient_id: string | null
    patient_name: string | null
    company_code: string | null
    company_name: string | null
    queue_number: number | null
    status: string | null
    priority: number | null
    clinic_code: string | null
    created_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type QueueCountAggregateOutputType = {
    id: number
    patient_id: number
    patient_name: number
    company_code: number
    company_name: number
    queue_number: number
    status: number
    priority: number
    clinic_code: number
    created_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type QueueAvgAggregateInputType = {
    id?: true
    queue_number?: true
    priority?: true
    created_by?: true
  }

  export type QueueSumAggregateInputType = {
    id?: true
    queue_number?: true
    priority?: true
    created_by?: true
  }

  export type QueueMinAggregateInputType = {
    id?: true
    patient_id?: true
    patient_name?: true
    company_code?: true
    company_name?: true
    queue_number?: true
    status?: true
    priority?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type QueueMaxAggregateInputType = {
    id?: true
    patient_id?: true
    patient_name?: true
    company_code?: true
    company_name?: true
    queue_number?: true
    status?: true
    priority?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type QueueCountAggregateInputType = {
    id?: true
    patient_id?: true
    patient_name?: true
    company_code?: true
    company_name?: true
    queue_number?: true
    status?: true
    priority?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
    updated_at?: true
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
    id: number
    patient_id: string
    patient_name: string
    company_code: string | null
    company_name: string | null
    queue_number: number
    status: string
    priority: number
    clinic_code: string | null
    created_by: number | null
    created_at: Date
    updated_at: Date
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
    patient_id?: boolean
    patient_name?: boolean
    company_code?: boolean
    company_name?: boolean
    queue_number?: boolean
    status?: boolean
    priority?: boolean
    clinic_code?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
    creator?: boolean | Queue$creatorArgs<ExtArgs>
    payments?: boolean | Queue$paymentsArgs<ExtArgs>
    _count?: boolean | QueueCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["queue"]>



  export type QueueSelectScalar = {
    id?: boolean
    patient_id?: boolean
    patient_name?: boolean
    company_code?: boolean
    company_name?: boolean
    queue_number?: boolean
    status?: boolean
    priority?: boolean
    clinic_code?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type QueueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patient_id" | "patient_name" | "company_code" | "company_name" | "queue_number" | "status" | "priority" | "clinic_code" | "created_by" | "created_at" | "updated_at", ExtArgs["result"]["queue"]>
  export type QueueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | Queue$creatorArgs<ExtArgs>
    payments?: boolean | Queue$paymentsArgs<ExtArgs>
    _count?: boolean | QueueCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $QueuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Queue"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs> | null
      payments: Prisma.$PaymentHistoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      patient_id: string
      patient_name: string
      company_code: string | null
      company_name: string | null
      queue_number: number
      status: string
      priority: number
      clinic_code: string | null
      created_by: number | null
      created_at: Date
      updated_at: Date
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
    creator<T extends Queue$creatorArgs<ExtArgs> = {}>(args?: Subset<T, Queue$creatorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    payments<T extends Queue$paymentsArgs<ExtArgs> = {}>(args?: Subset<T, Queue$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly id: FieldRef<"Queue", 'Int'>
    readonly patient_id: FieldRef<"Queue", 'String'>
    readonly patient_name: FieldRef<"Queue", 'String'>
    readonly company_code: FieldRef<"Queue", 'String'>
    readonly company_name: FieldRef<"Queue", 'String'>
    readonly queue_number: FieldRef<"Queue", 'Int'>
    readonly status: FieldRef<"Queue", 'String'>
    readonly priority: FieldRef<"Queue", 'Int'>
    readonly clinic_code: FieldRef<"Queue", 'String'>
    readonly created_by: FieldRef<"Queue", 'Int'>
    readonly created_at: FieldRef<"Queue", 'DateTime'>
    readonly updated_at: FieldRef<"Queue", 'DateTime'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
   * Queue.creator
   */
  export type Queue$creatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Queue.payments
   */
  export type Queue$paymentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    where?: PaymentHistoryWhereInput
    orderBy?: PaymentHistoryOrderByWithRelationInput | PaymentHistoryOrderByWithRelationInput[]
    cursor?: PaymentHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentHistoryScalarFieldEnum | PaymentHistoryScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
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
  }

  export type CardEnrollmentSumAggregateOutputType = {
    id: number | null
  }

  export type CardEnrollmentMinAggregateOutputType = {
    id: number | null
    card_number: string | null
    patient_id: string | null
    patient_name: string | null
    status: string | null
    registered_by: string | null
    registered_at: Date | null
    received_by: string | null
    received_at: Date | null
    verified_by: string | null
    verified_at: Date | null
    transferred_to: string | null
    transferred_at: Date | null
    clinic_code: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CardEnrollmentMaxAggregateOutputType = {
    id: number | null
    card_number: string | null
    patient_id: string | null
    patient_name: string | null
    status: string | null
    registered_by: string | null
    registered_at: Date | null
    received_by: string | null
    received_at: Date | null
    verified_by: string | null
    verified_at: Date | null
    transferred_to: string | null
    transferred_at: Date | null
    clinic_code: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CardEnrollmentCountAggregateOutputType = {
    id: number
    card_number: number
    patient_id: number
    patient_name: number
    status: number
    registered_by: number
    registered_at: number
    received_by: number
    received_at: number
    verified_by: number
    verified_at: number
    transferred_to: number
    transferred_at: number
    clinic_code: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CardEnrollmentAvgAggregateInputType = {
    id?: true
  }

  export type CardEnrollmentSumAggregateInputType = {
    id?: true
  }

  export type CardEnrollmentMinAggregateInputType = {
    id?: true
    card_number?: true
    patient_id?: true
    patient_name?: true
    status?: true
    registered_by?: true
    registered_at?: true
    received_by?: true
    received_at?: true
    verified_by?: true
    verified_at?: true
    transferred_to?: true
    transferred_at?: true
    clinic_code?: true
    created_at?: true
    updated_at?: true
  }

  export type CardEnrollmentMaxAggregateInputType = {
    id?: true
    card_number?: true
    patient_id?: true
    patient_name?: true
    status?: true
    registered_by?: true
    registered_at?: true
    received_by?: true
    received_at?: true
    verified_by?: true
    verified_at?: true
    transferred_to?: true
    transferred_at?: true
    clinic_code?: true
    created_at?: true
    updated_at?: true
  }

  export type CardEnrollmentCountAggregateInputType = {
    id?: true
    card_number?: true
    patient_id?: true
    patient_name?: true
    status?: true
    registered_by?: true
    registered_at?: true
    received_by?: true
    received_at?: true
    verified_by?: true
    verified_at?: true
    transferred_to?: true
    transferred_at?: true
    clinic_code?: true
    created_at?: true
    updated_at?: true
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
    card_number: string
    patient_id: string
    patient_name: string | null
    status: string
    registered_by: string | null
    registered_at: Date
    received_by: string | null
    received_at: Date | null
    verified_by: string | null
    verified_at: Date | null
    transferred_to: string | null
    transferred_at: Date | null
    clinic_code: string | null
    created_at: Date
    updated_at: Date
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
    card_number?: boolean
    patient_id?: boolean
    patient_name?: boolean
    status?: boolean
    registered_by?: boolean
    registered_at?: boolean
    received_by?: boolean
    received_at?: boolean
    verified_by?: boolean
    verified_at?: boolean
    transferred_to?: boolean
    transferred_at?: boolean
    clinic_code?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["cardEnrollment"]>



  export type CardEnrollmentSelectScalar = {
    id?: boolean
    card_number?: boolean
    patient_id?: boolean
    patient_name?: boolean
    status?: boolean
    registered_by?: boolean
    registered_at?: boolean
    received_by?: boolean
    received_at?: boolean
    verified_by?: boolean
    verified_at?: boolean
    transferred_to?: boolean
    transferred_at?: boolean
    clinic_code?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type CardEnrollmentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "card_number" | "patient_id" | "patient_name" | "status" | "registered_by" | "registered_at" | "received_by" | "received_at" | "verified_by" | "verified_at" | "transferred_to" | "transferred_at" | "clinic_code" | "created_at" | "updated_at", ExtArgs["result"]["cardEnrollment"]>

  export type $CardEnrollmentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CardEnrollment"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      card_number: string
      patient_id: string
      patient_name: string | null
      status: string
      registered_by: string | null
      registered_at: Date
      received_by: string | null
      received_at: Date | null
      verified_by: string | null
      verified_at: Date | null
      transferred_to: string | null
      transferred_at: Date | null
      clinic_code: string | null
      created_at: Date
      updated_at: Date
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
    readonly card_number: FieldRef<"CardEnrollment", 'String'>
    readonly patient_id: FieldRef<"CardEnrollment", 'String'>
    readonly patient_name: FieldRef<"CardEnrollment", 'String'>
    readonly status: FieldRef<"CardEnrollment", 'String'>
    readonly registered_by: FieldRef<"CardEnrollment", 'String'>
    readonly registered_at: FieldRef<"CardEnrollment", 'DateTime'>
    readonly received_by: FieldRef<"CardEnrollment", 'String'>
    readonly received_at: FieldRef<"CardEnrollment", 'DateTime'>
    readonly verified_by: FieldRef<"CardEnrollment", 'String'>
    readonly verified_at: FieldRef<"CardEnrollment", 'DateTime'>
    readonly transferred_to: FieldRef<"CardEnrollment", 'String'>
    readonly transferred_at: FieldRef<"CardEnrollment", 'DateTime'>
    readonly clinic_code: FieldRef<"CardEnrollment", 'String'>
    readonly created_at: FieldRef<"CardEnrollment", 'DateTime'>
    readonly updated_at: FieldRef<"CardEnrollment", 'DateTime'>
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
    data: XOR<CardEnrollmentCreateInput, CardEnrollmentUncheckedCreateInput>
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
    is_used: number | null
  }

  export type CardNumberSumAggregateOutputType = {
    id: number | null
    is_used: number | null
  }

  export type CardNumberMinAggregateOutputType = {
    id: number | null
    card_number: string | null
    barcode: string | null
    is_used: number | null
    created_at: Date | null
  }

  export type CardNumberMaxAggregateOutputType = {
    id: number | null
    card_number: string | null
    barcode: string | null
    is_used: number | null
    created_at: Date | null
  }

  export type CardNumberCountAggregateOutputType = {
    id: number
    card_number: number
    barcode: number
    is_used: number
    created_at: number
    _all: number
  }


  export type CardNumberAvgAggregateInputType = {
    id?: true
    is_used?: true
  }

  export type CardNumberSumAggregateInputType = {
    id?: true
    is_used?: true
  }

  export type CardNumberMinAggregateInputType = {
    id?: true
    card_number?: true
    barcode?: true
    is_used?: true
    created_at?: true
  }

  export type CardNumberMaxAggregateInputType = {
    id?: true
    card_number?: true
    barcode?: true
    is_used?: true
    created_at?: true
  }

  export type CardNumberCountAggregateInputType = {
    id?: true
    card_number?: true
    barcode?: true
    is_used?: true
    created_at?: true
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
    card_number: string
    barcode: string | null
    is_used: number
    created_at: Date
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
    card_number?: boolean
    barcode?: boolean
    is_used?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["cardNumber"]>



  export type CardNumberSelectScalar = {
    id?: boolean
    card_number?: boolean
    barcode?: boolean
    is_used?: boolean
    created_at?: boolean
  }

  export type CardNumberOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "card_number" | "barcode" | "is_used" | "created_at", ExtArgs["result"]["cardNumber"]>

  export type $CardNumberPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CardNumber"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      card_number: string
      barcode: string | null
      is_used: number
      created_at: Date
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
    readonly card_number: FieldRef<"CardNumber", 'String'>
    readonly barcode: FieldRef<"CardNumber", 'String'>
    readonly is_used: FieldRef<"CardNumber", 'Int'>
    readonly created_at: FieldRef<"CardNumber", 'DateTime'>
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
   * Model PaymentHistory
   */

  export type AggregatePaymentHistory = {
    _count: PaymentHistoryCountAggregateOutputType | null
    _avg: PaymentHistoryAvgAggregateOutputType | null
    _sum: PaymentHistorySumAggregateOutputType | null
    _min: PaymentHistoryMinAggregateOutputType | null
    _max: PaymentHistoryMaxAggregateOutputType | null
  }

  export type PaymentHistoryAvgAggregateOutputType = {
    id: number | null
    queue_id: number | null
    amount: Decimal | null
    created_by: number | null
  }

  export type PaymentHistorySumAggregateOutputType = {
    id: number | null
    queue_id: number | null
    amount: Decimal | null
    created_by: number | null
  }

  export type PaymentHistoryMinAggregateOutputType = {
    id: number | null
    patient_id: string | null
    queue_id: number | null
    amount: Decimal | null
    payment_method: string | null
    status: string | null
    transaction_no: string | null
    or_no: string | null
    clinic_code: string | null
    created_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PaymentHistoryMaxAggregateOutputType = {
    id: number | null
    patient_id: string | null
    queue_id: number | null
    amount: Decimal | null
    payment_method: string | null
    status: string | null
    transaction_no: string | null
    or_no: string | null
    clinic_code: string | null
    created_by: number | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PaymentHistoryCountAggregateOutputType = {
    id: number
    patient_id: number
    queue_id: number
    amount: number
    payment_method: number
    status: number
    transaction_no: number
    or_no: number
    clinic_code: number
    created_by: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type PaymentHistoryAvgAggregateInputType = {
    id?: true
    queue_id?: true
    amount?: true
    created_by?: true
  }

  export type PaymentHistorySumAggregateInputType = {
    id?: true
    queue_id?: true
    amount?: true
    created_by?: true
  }

  export type PaymentHistoryMinAggregateInputType = {
    id?: true
    patient_id?: true
    queue_id?: true
    amount?: true
    payment_method?: true
    status?: true
    transaction_no?: true
    or_no?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type PaymentHistoryMaxAggregateInputType = {
    id?: true
    patient_id?: true
    queue_id?: true
    amount?: true
    payment_method?: true
    status?: true
    transaction_no?: true
    or_no?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
    updated_at?: true
  }

  export type PaymentHistoryCountAggregateInputType = {
    id?: true
    patient_id?: true
    queue_id?: true
    amount?: true
    payment_method?: true
    status?: true
    transaction_no?: true
    or_no?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type PaymentHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentHistory to aggregate.
     */
    where?: PaymentHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentHistories to fetch.
     */
    orderBy?: PaymentHistoryOrderByWithRelationInput | PaymentHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentHistories
    **/
    _count?: true | PaymentHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentHistoryMaxAggregateInputType
  }

  export type GetPaymentHistoryAggregateType<T extends PaymentHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentHistory[P]>
      : GetScalarType<T[P], AggregatePaymentHistory[P]>
  }




  export type PaymentHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentHistoryWhereInput
    orderBy?: PaymentHistoryOrderByWithAggregationInput | PaymentHistoryOrderByWithAggregationInput[]
    by: PaymentHistoryScalarFieldEnum[] | PaymentHistoryScalarFieldEnum
    having?: PaymentHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentHistoryCountAggregateInputType | true
    _avg?: PaymentHistoryAvgAggregateInputType
    _sum?: PaymentHistorySumAggregateInputType
    _min?: PaymentHistoryMinAggregateInputType
    _max?: PaymentHistoryMaxAggregateInputType
  }

  export type PaymentHistoryGroupByOutputType = {
    id: number
    patient_id: string
    queue_id: number | null
    amount: Decimal
    payment_method: string | null
    status: string
    transaction_no: string | null
    or_no: string | null
    clinic_code: string | null
    created_by: number | null
    created_at: Date
    updated_at: Date
    _count: PaymentHistoryCountAggregateOutputType | null
    _avg: PaymentHistoryAvgAggregateOutputType | null
    _sum: PaymentHistorySumAggregateOutputType | null
    _min: PaymentHistoryMinAggregateOutputType | null
    _max: PaymentHistoryMaxAggregateOutputType | null
  }

  type GetPaymentHistoryGroupByPayload<T extends PaymentHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentHistoryGroupByOutputType[P]>
        }
      >
    >


  export type PaymentHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    patient_id?: boolean
    queue_id?: boolean
    amount?: boolean
    payment_method?: boolean
    status?: boolean
    transaction_no?: boolean
    or_no?: boolean
    clinic_code?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
    queue?: boolean | PaymentHistory$queueArgs<ExtArgs>
    creator?: boolean | PaymentHistory$creatorArgs<ExtArgs>
  }, ExtArgs["result"]["paymentHistory"]>



  export type PaymentHistorySelectScalar = {
    id?: boolean
    patient_id?: boolean
    queue_id?: boolean
    amount?: boolean
    payment_method?: boolean
    status?: boolean
    transaction_no?: boolean
    or_no?: boolean
    clinic_code?: boolean
    created_by?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type PaymentHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "patient_id" | "queue_id" | "amount" | "payment_method" | "status" | "transaction_no" | "or_no" | "clinic_code" | "created_by" | "created_at" | "updated_at", ExtArgs["result"]["paymentHistory"]>
  export type PaymentHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    queue?: boolean | PaymentHistory$queueArgs<ExtArgs>
    creator?: boolean | PaymentHistory$creatorArgs<ExtArgs>
  }

  export type $PaymentHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentHistory"
    objects: {
      queue: Prisma.$QueuePayload<ExtArgs> | null
      creator: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      patient_id: string
      queue_id: number | null
      amount: Prisma.Decimal
      payment_method: string | null
      status: string
      transaction_no: string | null
      or_no: string | null
      clinic_code: string | null
      created_by: number | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["paymentHistory"]>
    composites: {}
  }

  type PaymentHistoryGetPayload<S extends boolean | null | undefined | PaymentHistoryDefaultArgs> = $Result.GetResult<Prisma.$PaymentHistoryPayload, S>

  type PaymentHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PaymentHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PaymentHistoryCountAggregateInputType | true
    }

  export interface PaymentHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentHistory'], meta: { name: 'PaymentHistory' } }
    /**
     * Find zero or one PaymentHistory that matches the filter.
     * @param {PaymentHistoryFindUniqueArgs} args - Arguments to find a PaymentHistory
     * @example
     * // Get one PaymentHistory
     * const paymentHistory = await prisma.paymentHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PaymentHistoryFindUniqueArgs>(args: SelectSubset<T, PaymentHistoryFindUniqueArgs<ExtArgs>>): Prisma__PaymentHistoryClient<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PaymentHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PaymentHistoryFindUniqueOrThrowArgs} args - Arguments to find a PaymentHistory
     * @example
     * // Get one PaymentHistory
     * const paymentHistory = await prisma.paymentHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PaymentHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, PaymentHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PaymentHistoryClient<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentHistoryFindFirstArgs} args - Arguments to find a PaymentHistory
     * @example
     * // Get one PaymentHistory
     * const paymentHistory = await prisma.paymentHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PaymentHistoryFindFirstArgs>(args?: SelectSubset<T, PaymentHistoryFindFirstArgs<ExtArgs>>): Prisma__PaymentHistoryClient<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PaymentHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentHistoryFindFirstOrThrowArgs} args - Arguments to find a PaymentHistory
     * @example
     * // Get one PaymentHistory
     * const paymentHistory = await prisma.paymentHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PaymentHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, PaymentHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__PaymentHistoryClient<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PaymentHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentHistories
     * const paymentHistories = await prisma.paymentHistory.findMany()
     * 
     * // Get first 10 PaymentHistories
     * const paymentHistories = await prisma.paymentHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentHistoryWithIdOnly = await prisma.paymentHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PaymentHistoryFindManyArgs>(args?: SelectSubset<T, PaymentHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PaymentHistory.
     * @param {PaymentHistoryCreateArgs} args - Arguments to create a PaymentHistory.
     * @example
     * // Create one PaymentHistory
     * const PaymentHistory = await prisma.paymentHistory.create({
     *   data: {
     *     // ... data to create a PaymentHistory
     *   }
     * })
     * 
     */
    create<T extends PaymentHistoryCreateArgs>(args: SelectSubset<T, PaymentHistoryCreateArgs<ExtArgs>>): Prisma__PaymentHistoryClient<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PaymentHistories.
     * @param {PaymentHistoryCreateManyArgs} args - Arguments to create many PaymentHistories.
     * @example
     * // Create many PaymentHistories
     * const paymentHistory = await prisma.paymentHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PaymentHistoryCreateManyArgs>(args?: SelectSubset<T, PaymentHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a PaymentHistory.
     * @param {PaymentHistoryDeleteArgs} args - Arguments to delete one PaymentHistory.
     * @example
     * // Delete one PaymentHistory
     * const PaymentHistory = await prisma.paymentHistory.delete({
     *   where: {
     *     // ... filter to delete one PaymentHistory
     *   }
     * })
     * 
     */
    delete<T extends PaymentHistoryDeleteArgs>(args: SelectSubset<T, PaymentHistoryDeleteArgs<ExtArgs>>): Prisma__PaymentHistoryClient<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PaymentHistory.
     * @param {PaymentHistoryUpdateArgs} args - Arguments to update one PaymentHistory.
     * @example
     * // Update one PaymentHistory
     * const paymentHistory = await prisma.paymentHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PaymentHistoryUpdateArgs>(args: SelectSubset<T, PaymentHistoryUpdateArgs<ExtArgs>>): Prisma__PaymentHistoryClient<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PaymentHistories.
     * @param {PaymentHistoryDeleteManyArgs} args - Arguments to filter PaymentHistories to delete.
     * @example
     * // Delete a few PaymentHistories
     * const { count } = await prisma.paymentHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PaymentHistoryDeleteManyArgs>(args?: SelectSubset<T, PaymentHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentHistories
     * const paymentHistory = await prisma.paymentHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PaymentHistoryUpdateManyArgs>(args: SelectSubset<T, PaymentHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentHistory.
     * @param {PaymentHistoryUpsertArgs} args - Arguments to update or create a PaymentHistory.
     * @example
     * // Update or create a PaymentHistory
     * const paymentHistory = await prisma.paymentHistory.upsert({
     *   create: {
     *     // ... data to create a PaymentHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentHistory we want to update
     *   }
     * })
     */
    upsert<T extends PaymentHistoryUpsertArgs>(args: SelectSubset<T, PaymentHistoryUpsertArgs<ExtArgs>>): Prisma__PaymentHistoryClient<$Result.GetResult<Prisma.$PaymentHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PaymentHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentHistoryCountArgs} args - Arguments to filter PaymentHistories to count.
     * @example
     * // Count the number of PaymentHistories
     * const count = await prisma.paymentHistory.count({
     *   where: {
     *     // ... the filter for the PaymentHistories we want to count
     *   }
     * })
    **/
    count<T extends PaymentHistoryCountArgs>(
      args?: Subset<T, PaymentHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PaymentHistoryAggregateArgs>(args: Subset<T, PaymentHistoryAggregateArgs>): Prisma.PrismaPromise<GetPaymentHistoryAggregateType<T>>

    /**
     * Group by PaymentHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentHistoryGroupByArgs} args - Group by arguments.
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
      T extends PaymentHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentHistoryGroupByArgs['orderBy'] }
        : { orderBy?: PaymentHistoryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PaymentHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentHistory model
   */
  readonly fields: PaymentHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    queue<T extends PaymentHistory$queueArgs<ExtArgs> = {}>(args?: Subset<T, PaymentHistory$queueArgs<ExtArgs>>): Prisma__QueueClient<$Result.GetResult<Prisma.$QueuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    creator<T extends PaymentHistory$creatorArgs<ExtArgs> = {}>(args?: Subset<T, PaymentHistory$creatorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the PaymentHistory model
   */
  interface PaymentHistoryFieldRefs {
    readonly id: FieldRef<"PaymentHistory", 'Int'>
    readonly patient_id: FieldRef<"PaymentHistory", 'String'>
    readonly queue_id: FieldRef<"PaymentHistory", 'Int'>
    readonly amount: FieldRef<"PaymentHistory", 'Decimal'>
    readonly payment_method: FieldRef<"PaymentHistory", 'String'>
    readonly status: FieldRef<"PaymentHistory", 'String'>
    readonly transaction_no: FieldRef<"PaymentHistory", 'String'>
    readonly or_no: FieldRef<"PaymentHistory", 'String'>
    readonly clinic_code: FieldRef<"PaymentHistory", 'String'>
    readonly created_by: FieldRef<"PaymentHistory", 'Int'>
    readonly created_at: FieldRef<"PaymentHistory", 'DateTime'>
    readonly updated_at: FieldRef<"PaymentHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentHistory findUnique
   */
  export type PaymentHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PaymentHistory to fetch.
     */
    where: PaymentHistoryWhereUniqueInput
  }

  /**
   * PaymentHistory findUniqueOrThrow
   */
  export type PaymentHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PaymentHistory to fetch.
     */
    where: PaymentHistoryWhereUniqueInput
  }

  /**
   * PaymentHistory findFirst
   */
  export type PaymentHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PaymentHistory to fetch.
     */
    where?: PaymentHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentHistories to fetch.
     */
    orderBy?: PaymentHistoryOrderByWithRelationInput | PaymentHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentHistories.
     */
    cursor?: PaymentHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentHistories.
     */
    distinct?: PaymentHistoryScalarFieldEnum | PaymentHistoryScalarFieldEnum[]
  }

  /**
   * PaymentHistory findFirstOrThrow
   */
  export type PaymentHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PaymentHistory to fetch.
     */
    where?: PaymentHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentHistories to fetch.
     */
    orderBy?: PaymentHistoryOrderByWithRelationInput | PaymentHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentHistories.
     */
    cursor?: PaymentHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentHistories.
     */
    distinct?: PaymentHistoryScalarFieldEnum | PaymentHistoryScalarFieldEnum[]
  }

  /**
   * PaymentHistory findMany
   */
  export type PaymentHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * Filter, which PaymentHistories to fetch.
     */
    where?: PaymentHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentHistories to fetch.
     */
    orderBy?: PaymentHistoryOrderByWithRelationInput | PaymentHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentHistories.
     */
    cursor?: PaymentHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentHistories.
     */
    skip?: number
    distinct?: PaymentHistoryScalarFieldEnum | PaymentHistoryScalarFieldEnum[]
  }

  /**
   * PaymentHistory create
   */
  export type PaymentHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentHistory.
     */
    data: XOR<PaymentHistoryCreateInput, PaymentHistoryUncheckedCreateInput>
  }

  /**
   * PaymentHistory createMany
   */
  export type PaymentHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentHistories.
     */
    data: PaymentHistoryCreateManyInput | PaymentHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentHistory update
   */
  export type PaymentHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentHistory.
     */
    data: XOR<PaymentHistoryUpdateInput, PaymentHistoryUncheckedUpdateInput>
    /**
     * Choose, which PaymentHistory to update.
     */
    where: PaymentHistoryWhereUniqueInput
  }

  /**
   * PaymentHistory updateMany
   */
  export type PaymentHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentHistories.
     */
    data: XOR<PaymentHistoryUpdateManyMutationInput, PaymentHistoryUncheckedUpdateManyInput>
    /**
     * Filter which PaymentHistories to update
     */
    where?: PaymentHistoryWhereInput
    /**
     * Limit how many PaymentHistories to update.
     */
    limit?: number
  }

  /**
   * PaymentHistory upsert
   */
  export type PaymentHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentHistory to update in case it exists.
     */
    where: PaymentHistoryWhereUniqueInput
    /**
     * In case the PaymentHistory found by the `where` argument doesn't exist, create a new PaymentHistory with this data.
     */
    create: XOR<PaymentHistoryCreateInput, PaymentHistoryUncheckedCreateInput>
    /**
     * In case the PaymentHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentHistoryUpdateInput, PaymentHistoryUncheckedUpdateInput>
  }

  /**
   * PaymentHistory delete
   */
  export type PaymentHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
    /**
     * Filter which PaymentHistory to delete.
     */
    where: PaymentHistoryWhereUniqueInput
  }

  /**
   * PaymentHistory deleteMany
   */
  export type PaymentHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentHistories to delete
     */
    where?: PaymentHistoryWhereInput
    /**
     * Limit how many PaymentHistories to delete.
     */
    limit?: number
  }

  /**
   * PaymentHistory.queue
   */
  export type PaymentHistory$queueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Queue
     */
    select?: QueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Queue
     */
    omit?: QueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: QueueInclude<ExtArgs> | null
    where?: QueueWhereInput
  }

  /**
   * PaymentHistory.creator
   */
  export type PaymentHistory$creatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * PaymentHistory without action
   */
  export type PaymentHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentHistory
     */
    select?: PaymentHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the PaymentHistory
     */
    omit?: PaymentHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentHistoryInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    id: number | null
    amount: Decimal | null
    created_by: number | null
  }

  export type TransactionSumAggregateOutputType = {
    id: number | null
    amount: Decimal | null
    created_by: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: number | null
    transaction_no: string | null
    patient_id: string | null
    type: string | null
    amount: Decimal | null
    description: string | null
    clinic_code: string | null
    created_by: number | null
    created_at: Date | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: number | null
    transaction_no: string | null
    patient_id: string | null
    type: string | null
    amount: Decimal | null
    description: string | null
    clinic_code: string | null
    created_by: number | null
    created_at: Date | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    transaction_no: number
    patient_id: number
    type: number
    amount: number
    description: number
    clinic_code: number
    created_by: number
    created_at: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    id?: true
    amount?: true
    created_by?: true
  }

  export type TransactionSumAggregateInputType = {
    id?: true
    amount?: true
    created_by?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    transaction_no?: true
    patient_id?: true
    type?: true
    amount?: true
    description?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    transaction_no?: true
    patient_id?: true
    type?: true
    amount?: true
    description?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    transaction_no?: true
    patient_id?: true
    type?: true
    amount?: true
    description?: true
    clinic_code?: true
    created_by?: true
    created_at?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: number
    transaction_no: string
    patient_id: string
    type: string
    amount: Decimal
    description: string | null
    clinic_code: string | null
    created_by: number | null
    created_at: Date
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    transaction_no?: boolean
    patient_id?: boolean
    type?: boolean
    amount?: boolean
    description?: boolean
    clinic_code?: boolean
    created_by?: boolean
    created_at?: boolean
    creator?: boolean | Transaction$creatorArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>



  export type TransactionSelectScalar = {
    id?: boolean
    transaction_no?: boolean
    patient_id?: boolean
    type?: boolean
    amount?: boolean
    description?: boolean
    clinic_code?: boolean
    created_by?: boolean
    created_at?: boolean
  }

  export type TransactionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "transaction_no" | "patient_id" | "type" | "amount" | "description" | "clinic_code" | "created_by" | "created_at", ExtArgs["result"]["transaction"]>
  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | Transaction$creatorArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      transaction_no: string
      patient_id: string
      type: string
      amount: Prisma.Decimal
      description: string | null
      clinic_code: string | null
      created_by: number | null
      created_at: Date
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
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
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends Transaction$creatorArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$creatorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'Int'>
    readonly transaction_no: FieldRef<"Transaction", 'String'>
    readonly patient_id: FieldRef<"Transaction", 'String'>
    readonly type: FieldRef<"Transaction", 'String'>
    readonly amount: FieldRef<"Transaction", 'Decimal'>
    readonly description: FieldRef<"Transaction", 'String'>
    readonly clinic_code: FieldRef<"Transaction", 'String'>
    readonly created_by: FieldRef<"Transaction", 'Int'>
    readonly created_at: FieldRef<"Transaction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to update.
     */
    limit?: number
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number
  }

  /**
   * Transaction.creator
   */
  export type Transaction$creatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _avg: CompanyAvgAggregateOutputType | null
    _sum: CompanySumAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyAvgAggregateOutputType = {
    id: number | null
  }

  export type CompanySumAggregateOutputType = {
    id: number | null
  }

  export type CompanyMinAggregateOutputType = {
    id: number | null
    eros_code: string | null
    name: string | null
    address: string | null
    contact: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: number | null
    eros_code: string | null
    name: string | null
    address: string | null
    contact: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    eros_code: number
    name: number
    address: number
    contact: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type CompanyAvgAggregateInputType = {
    id?: true
  }

  export type CompanySumAggregateInputType = {
    id?: true
  }

  export type CompanyMinAggregateInputType = {
    id?: true
    eros_code?: true
    name?: true
    address?: true
    contact?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    eros_code?: true
    name?: true
    address?: true
    contact?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    eros_code?: true
    name?: true
    address?: true
    contact?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CompanyAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CompanySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _avg?: CompanyAvgAggregateInputType
    _sum?: CompanySumAggregateInputType
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: number
    eros_code: string
    name: string
    address: string | null
    contact: string | null
    status: string
    created_at: Date
    updated_at: Date
    _count: CompanyCountAggregateOutputType | null
    _avg: CompanyAvgAggregateOutputType | null
    _sum: CompanySumAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    eros_code?: boolean
    name?: boolean
    address?: boolean
    contact?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    items?: boolean | Company$itemsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>



  export type CompanySelectScalar = {
    id?: boolean
    eros_code?: boolean
    name?: boolean
    address?: boolean
    contact?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type CompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "eros_code" | "name" | "address" | "contact" | "status" | "created_at" | "updated_at", ExtArgs["result"]["company"]>
  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | Company$itemsArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      items: Prisma.$ItemPricePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      eros_code: string
      name: string
      address: string | null
      contact: string | null
      status: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
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
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    items<T extends Company$itemsArgs<ExtArgs> = {}>(args?: Subset<T, Company$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Company model
   */
  interface CompanyFieldRefs {
    readonly id: FieldRef<"Company", 'Int'>
    readonly eros_code: FieldRef<"Company", 'String'>
    readonly name: FieldRef<"Company", 'String'>
    readonly address: FieldRef<"Company", 'String'>
    readonly contact: FieldRef<"Company", 'String'>
    readonly status: FieldRef<"Company", 'String'>
    readonly created_at: FieldRef<"Company", 'DateTime'>
    readonly updated_at: FieldRef<"Company", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to delete.
     */
    limit?: number
  }

  /**
   * Company.items
   */
  export type Company$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    where?: ItemPriceWhereInput
    orderBy?: ItemPriceOrderByWithRelationInput | ItemPriceOrderByWithRelationInput[]
    cursor?: ItemPriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemPriceScalarFieldEnum | ItemPriceScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model ItemMaster
   */

  export type AggregateItemMaster = {
    _count: ItemMasterCountAggregateOutputType | null
    _avg: ItemMasterAvgAggregateOutputType | null
    _sum: ItemMasterSumAggregateOutputType | null
    _min: ItemMasterMinAggregateOutputType | null
    _max: ItemMasterMaxAggregateOutputType | null
  }

  export type ItemMasterAvgAggregateOutputType = {
    id: number | null
  }

  export type ItemMasterSumAggregateOutputType = {
    id: number | null
  }

  export type ItemMasterMinAggregateOutputType = {
    id: number | null
    item_code: string | null
    item_name: string | null
    category: string | null
    department: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ItemMasterMaxAggregateOutputType = {
    id: number | null
    item_code: string | null
    item_name: string | null
    category: string | null
    department: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ItemMasterCountAggregateOutputType = {
    id: number
    item_code: number
    item_name: number
    category: number
    department: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ItemMasterAvgAggregateInputType = {
    id?: true
  }

  export type ItemMasterSumAggregateInputType = {
    id?: true
  }

  export type ItemMasterMinAggregateInputType = {
    id?: true
    item_code?: true
    item_name?: true
    category?: true
    department?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type ItemMasterMaxAggregateInputType = {
    id?: true
    item_code?: true
    item_name?: true
    category?: true
    department?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type ItemMasterCountAggregateInputType = {
    id?: true
    item_code?: true
    item_name?: true
    category?: true
    department?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ItemMasterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemMaster to aggregate.
     */
    where?: ItemMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemMasters to fetch.
     */
    orderBy?: ItemMasterOrderByWithRelationInput | ItemMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ItemMasters
    **/
    _count?: true | ItemMasterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemMasterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemMasterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemMasterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemMasterMaxAggregateInputType
  }

  export type GetItemMasterAggregateType<T extends ItemMasterAggregateArgs> = {
        [P in keyof T & keyof AggregateItemMaster]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItemMaster[P]>
      : GetScalarType<T[P], AggregateItemMaster[P]>
  }




  export type ItemMasterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemMasterWhereInput
    orderBy?: ItemMasterOrderByWithAggregationInput | ItemMasterOrderByWithAggregationInput[]
    by: ItemMasterScalarFieldEnum[] | ItemMasterScalarFieldEnum
    having?: ItemMasterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemMasterCountAggregateInputType | true
    _avg?: ItemMasterAvgAggregateInputType
    _sum?: ItemMasterSumAggregateInputType
    _min?: ItemMasterMinAggregateInputType
    _max?: ItemMasterMaxAggregateInputType
  }

  export type ItemMasterGroupByOutputType = {
    id: number
    item_code: string
    item_name: string
    category: string | null
    department: string | null
    status: string
    created_at: Date
    updated_at: Date
    _count: ItemMasterCountAggregateOutputType | null
    _avg: ItemMasterAvgAggregateOutputType | null
    _sum: ItemMasterSumAggregateOutputType | null
    _min: ItemMasterMinAggregateOutputType | null
    _max: ItemMasterMaxAggregateOutputType | null
  }

  type GetItemMasterGroupByPayload<T extends ItemMasterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemMasterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemMasterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemMasterGroupByOutputType[P]>
            : GetScalarType<T[P], ItemMasterGroupByOutputType[P]>
        }
      >
    >


  export type ItemMasterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    item_code?: boolean
    item_name?: boolean
    category?: boolean
    department?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    prices?: boolean | ItemMaster$pricesArgs<ExtArgs>
    _count?: boolean | ItemMasterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itemMaster"]>



  export type ItemMasterSelectScalar = {
    id?: boolean
    item_code?: boolean
    item_name?: boolean
    category?: boolean
    department?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ItemMasterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "item_code" | "item_name" | "category" | "department" | "status" | "created_at" | "updated_at", ExtArgs["result"]["itemMaster"]>
  export type ItemMasterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prices?: boolean | ItemMaster$pricesArgs<ExtArgs>
    _count?: boolean | ItemMasterCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ItemMasterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ItemMaster"
    objects: {
      prices: Prisma.$ItemPricePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      item_code: string
      item_name: string
      category: string | null
      department: string | null
      status: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["itemMaster"]>
    composites: {}
  }

  type ItemMasterGetPayload<S extends boolean | null | undefined | ItemMasterDefaultArgs> = $Result.GetResult<Prisma.$ItemMasterPayload, S>

  type ItemMasterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ItemMasterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ItemMasterCountAggregateInputType | true
    }

  export interface ItemMasterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ItemMaster'], meta: { name: 'ItemMaster' } }
    /**
     * Find zero or one ItemMaster that matches the filter.
     * @param {ItemMasterFindUniqueArgs} args - Arguments to find a ItemMaster
     * @example
     * // Get one ItemMaster
     * const itemMaster = await prisma.itemMaster.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemMasterFindUniqueArgs>(args: SelectSubset<T, ItemMasterFindUniqueArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ItemMaster that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItemMasterFindUniqueOrThrowArgs} args - Arguments to find a ItemMaster
     * @example
     * // Get one ItemMaster
     * const itemMaster = await prisma.itemMaster.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemMasterFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemMasterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItemMaster that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemMasterFindFirstArgs} args - Arguments to find a ItemMaster
     * @example
     * // Get one ItemMaster
     * const itemMaster = await prisma.itemMaster.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemMasterFindFirstArgs>(args?: SelectSubset<T, ItemMasterFindFirstArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItemMaster that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemMasterFindFirstOrThrowArgs} args - Arguments to find a ItemMaster
     * @example
     * // Get one ItemMaster
     * const itemMaster = await prisma.itemMaster.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemMasterFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemMasterFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ItemMasters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemMasterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ItemMasters
     * const itemMasters = await prisma.itemMaster.findMany()
     * 
     * // Get first 10 ItemMasters
     * const itemMasters = await prisma.itemMaster.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemMasterWithIdOnly = await prisma.itemMaster.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemMasterFindManyArgs>(args?: SelectSubset<T, ItemMasterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ItemMaster.
     * @param {ItemMasterCreateArgs} args - Arguments to create a ItemMaster.
     * @example
     * // Create one ItemMaster
     * const ItemMaster = await prisma.itemMaster.create({
     *   data: {
     *     // ... data to create a ItemMaster
     *   }
     * })
     * 
     */
    create<T extends ItemMasterCreateArgs>(args: SelectSubset<T, ItemMasterCreateArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ItemMasters.
     * @param {ItemMasterCreateManyArgs} args - Arguments to create many ItemMasters.
     * @example
     * // Create many ItemMasters
     * const itemMaster = await prisma.itemMaster.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemMasterCreateManyArgs>(args?: SelectSubset<T, ItemMasterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ItemMaster.
     * @param {ItemMasterDeleteArgs} args - Arguments to delete one ItemMaster.
     * @example
     * // Delete one ItemMaster
     * const ItemMaster = await prisma.itemMaster.delete({
     *   where: {
     *     // ... filter to delete one ItemMaster
     *   }
     * })
     * 
     */
    delete<T extends ItemMasterDeleteArgs>(args: SelectSubset<T, ItemMasterDeleteArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ItemMaster.
     * @param {ItemMasterUpdateArgs} args - Arguments to update one ItemMaster.
     * @example
     * // Update one ItemMaster
     * const itemMaster = await prisma.itemMaster.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemMasterUpdateArgs>(args: SelectSubset<T, ItemMasterUpdateArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ItemMasters.
     * @param {ItemMasterDeleteManyArgs} args - Arguments to filter ItemMasters to delete.
     * @example
     * // Delete a few ItemMasters
     * const { count } = await prisma.itemMaster.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemMasterDeleteManyArgs>(args?: SelectSubset<T, ItemMasterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ItemMasters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemMasterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ItemMasters
     * const itemMaster = await prisma.itemMaster.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemMasterUpdateManyArgs>(args: SelectSubset<T, ItemMasterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ItemMaster.
     * @param {ItemMasterUpsertArgs} args - Arguments to update or create a ItemMaster.
     * @example
     * // Update or create a ItemMaster
     * const itemMaster = await prisma.itemMaster.upsert({
     *   create: {
     *     // ... data to create a ItemMaster
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ItemMaster we want to update
     *   }
     * })
     */
    upsert<T extends ItemMasterUpsertArgs>(args: SelectSubset<T, ItemMasterUpsertArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ItemMasters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemMasterCountArgs} args - Arguments to filter ItemMasters to count.
     * @example
     * // Count the number of ItemMasters
     * const count = await prisma.itemMaster.count({
     *   where: {
     *     // ... the filter for the ItemMasters we want to count
     *   }
     * })
    **/
    count<T extends ItemMasterCountArgs>(
      args?: Subset<T, ItemMasterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemMasterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ItemMaster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemMasterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ItemMasterAggregateArgs>(args: Subset<T, ItemMasterAggregateArgs>): Prisma.PrismaPromise<GetItemMasterAggregateType<T>>

    /**
     * Group by ItemMaster.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemMasterGroupByArgs} args - Group by arguments.
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
      T extends ItemMasterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemMasterGroupByArgs['orderBy'] }
        : { orderBy?: ItemMasterGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ItemMasterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemMasterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ItemMaster model
   */
  readonly fields: ItemMasterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ItemMaster.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemMasterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prices<T extends ItemMaster$pricesArgs<ExtArgs> = {}>(args?: Subset<T, ItemMaster$pricesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ItemMaster model
   */
  interface ItemMasterFieldRefs {
    readonly id: FieldRef<"ItemMaster", 'Int'>
    readonly item_code: FieldRef<"ItemMaster", 'String'>
    readonly item_name: FieldRef<"ItemMaster", 'String'>
    readonly category: FieldRef<"ItemMaster", 'String'>
    readonly department: FieldRef<"ItemMaster", 'String'>
    readonly status: FieldRef<"ItemMaster", 'String'>
    readonly created_at: FieldRef<"ItemMaster", 'DateTime'>
    readonly updated_at: FieldRef<"ItemMaster", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ItemMaster findUnique
   */
  export type ItemMasterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * Filter, which ItemMaster to fetch.
     */
    where: ItemMasterWhereUniqueInput
  }

  /**
   * ItemMaster findUniqueOrThrow
   */
  export type ItemMasterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * Filter, which ItemMaster to fetch.
     */
    where: ItemMasterWhereUniqueInput
  }

  /**
   * ItemMaster findFirst
   */
  export type ItemMasterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * Filter, which ItemMaster to fetch.
     */
    where?: ItemMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemMasters to fetch.
     */
    orderBy?: ItemMasterOrderByWithRelationInput | ItemMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemMasters.
     */
    cursor?: ItemMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemMasters.
     */
    distinct?: ItemMasterScalarFieldEnum | ItemMasterScalarFieldEnum[]
  }

  /**
   * ItemMaster findFirstOrThrow
   */
  export type ItemMasterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * Filter, which ItemMaster to fetch.
     */
    where?: ItemMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemMasters to fetch.
     */
    orderBy?: ItemMasterOrderByWithRelationInput | ItemMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemMasters.
     */
    cursor?: ItemMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemMasters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemMasters.
     */
    distinct?: ItemMasterScalarFieldEnum | ItemMasterScalarFieldEnum[]
  }

  /**
   * ItemMaster findMany
   */
  export type ItemMasterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * Filter, which ItemMasters to fetch.
     */
    where?: ItemMasterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemMasters to fetch.
     */
    orderBy?: ItemMasterOrderByWithRelationInput | ItemMasterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ItemMasters.
     */
    cursor?: ItemMasterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemMasters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemMasters.
     */
    skip?: number
    distinct?: ItemMasterScalarFieldEnum | ItemMasterScalarFieldEnum[]
  }

  /**
   * ItemMaster create
   */
  export type ItemMasterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * The data needed to create a ItemMaster.
     */
    data: XOR<ItemMasterCreateInput, ItemMasterUncheckedCreateInput>
  }

  /**
   * ItemMaster createMany
   */
  export type ItemMasterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ItemMasters.
     */
    data: ItemMasterCreateManyInput | ItemMasterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ItemMaster update
   */
  export type ItemMasterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * The data needed to update a ItemMaster.
     */
    data: XOR<ItemMasterUpdateInput, ItemMasterUncheckedUpdateInput>
    /**
     * Choose, which ItemMaster to update.
     */
    where: ItemMasterWhereUniqueInput
  }

  /**
   * ItemMaster updateMany
   */
  export type ItemMasterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ItemMasters.
     */
    data: XOR<ItemMasterUpdateManyMutationInput, ItemMasterUncheckedUpdateManyInput>
    /**
     * Filter which ItemMasters to update
     */
    where?: ItemMasterWhereInput
    /**
     * Limit how many ItemMasters to update.
     */
    limit?: number
  }

  /**
   * ItemMaster upsert
   */
  export type ItemMasterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * The filter to search for the ItemMaster to update in case it exists.
     */
    where: ItemMasterWhereUniqueInput
    /**
     * In case the ItemMaster found by the `where` argument doesn't exist, create a new ItemMaster with this data.
     */
    create: XOR<ItemMasterCreateInput, ItemMasterUncheckedCreateInput>
    /**
     * In case the ItemMaster was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemMasterUpdateInput, ItemMasterUncheckedUpdateInput>
  }

  /**
   * ItemMaster delete
   */
  export type ItemMasterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
    /**
     * Filter which ItemMaster to delete.
     */
    where: ItemMasterWhereUniqueInput
  }

  /**
   * ItemMaster deleteMany
   */
  export type ItemMasterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemMasters to delete
     */
    where?: ItemMasterWhereInput
    /**
     * Limit how many ItemMasters to delete.
     */
    limit?: number
  }

  /**
   * ItemMaster.prices
   */
  export type ItemMaster$pricesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    where?: ItemPriceWhereInput
    orderBy?: ItemPriceOrderByWithRelationInput | ItemPriceOrderByWithRelationInput[]
    cursor?: ItemPriceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ItemPriceScalarFieldEnum | ItemPriceScalarFieldEnum[]
  }

  /**
   * ItemMaster without action
   */
  export type ItemMasterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemMaster
     */
    select?: ItemMasterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemMaster
     */
    omit?: ItemMasterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemMasterInclude<ExtArgs> | null
  }


  /**
   * Model ItemPrice
   */

  export type AggregateItemPrice = {
    _count: ItemPriceCountAggregateOutputType | null
    _avg: ItemPriceAvgAggregateOutputType | null
    _sum: ItemPriceSumAggregateOutputType | null
    _min: ItemPriceMinAggregateOutputType | null
    _max: ItemPriceMaxAggregateOutputType | null
  }

  export type ItemPriceAvgAggregateOutputType = {
    id: number | null
    price: Decimal | null
  }

  export type ItemPriceSumAggregateOutputType = {
    id: number | null
    price: Decimal | null
  }

  export type ItemPriceMinAggregateOutputType = {
    id: number | null
    item_code: string | null
    company_code: string | null
    price: Decimal | null
    price_group: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ItemPriceMaxAggregateOutputType = {
    id: number | null
    item_code: string | null
    company_code: string | null
    price: Decimal | null
    price_group: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type ItemPriceCountAggregateOutputType = {
    id: number
    item_code: number
    company_code: number
    price: number
    price_group: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type ItemPriceAvgAggregateInputType = {
    id?: true
    price?: true
  }

  export type ItemPriceSumAggregateInputType = {
    id?: true
    price?: true
  }

  export type ItemPriceMinAggregateInputType = {
    id?: true
    item_code?: true
    company_code?: true
    price?: true
    price_group?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type ItemPriceMaxAggregateInputType = {
    id?: true
    item_code?: true
    company_code?: true
    price?: true
    price_group?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type ItemPriceCountAggregateInputType = {
    id?: true
    item_code?: true
    company_code?: true
    price?: true
    price_group?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type ItemPriceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemPrice to aggregate.
     */
    where?: ItemPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemPrices to fetch.
     */
    orderBy?: ItemPriceOrderByWithRelationInput | ItemPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ItemPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ItemPrices
    **/
    _count?: true | ItemPriceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ItemPriceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ItemPriceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ItemPriceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ItemPriceMaxAggregateInputType
  }

  export type GetItemPriceAggregateType<T extends ItemPriceAggregateArgs> = {
        [P in keyof T & keyof AggregateItemPrice]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateItemPrice[P]>
      : GetScalarType<T[P], AggregateItemPrice[P]>
  }




  export type ItemPriceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ItemPriceWhereInput
    orderBy?: ItemPriceOrderByWithAggregationInput | ItemPriceOrderByWithAggregationInput[]
    by: ItemPriceScalarFieldEnum[] | ItemPriceScalarFieldEnum
    having?: ItemPriceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ItemPriceCountAggregateInputType | true
    _avg?: ItemPriceAvgAggregateInputType
    _sum?: ItemPriceSumAggregateInputType
    _min?: ItemPriceMinAggregateInputType
    _max?: ItemPriceMaxAggregateInputType
  }

  export type ItemPriceGroupByOutputType = {
    id: number
    item_code: string
    company_code: string
    price: Decimal
    price_group: string | null
    status: string
    created_at: Date
    updated_at: Date
    _count: ItemPriceCountAggregateOutputType | null
    _avg: ItemPriceAvgAggregateOutputType | null
    _sum: ItemPriceSumAggregateOutputType | null
    _min: ItemPriceMinAggregateOutputType | null
    _max: ItemPriceMaxAggregateOutputType | null
  }

  type GetItemPriceGroupByPayload<T extends ItemPriceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ItemPriceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ItemPriceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ItemPriceGroupByOutputType[P]>
            : GetScalarType<T[P], ItemPriceGroupByOutputType[P]>
        }
      >
    >


  export type ItemPriceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    item_code?: boolean
    company_code?: boolean
    price?: boolean
    price_group?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
    item?: boolean | ItemMasterDefaultArgs<ExtArgs>
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["itemPrice"]>



  export type ItemPriceSelectScalar = {
    id?: boolean
    item_code?: boolean
    company_code?: boolean
    price?: boolean
    price_group?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type ItemPriceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "item_code" | "company_code" | "price" | "price_group" | "status" | "created_at" | "updated_at", ExtArgs["result"]["itemPrice"]>
  export type ItemPriceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    item?: boolean | ItemMasterDefaultArgs<ExtArgs>
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }

  export type $ItemPricePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ItemPrice"
    objects: {
      item: Prisma.$ItemMasterPayload<ExtArgs>
      company: Prisma.$CompanyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      item_code: string
      company_code: string
      price: Prisma.Decimal
      price_group: string | null
      status: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["itemPrice"]>
    composites: {}
  }

  type ItemPriceGetPayload<S extends boolean | null | undefined | ItemPriceDefaultArgs> = $Result.GetResult<Prisma.$ItemPricePayload, S>

  type ItemPriceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ItemPriceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ItemPriceCountAggregateInputType | true
    }

  export interface ItemPriceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ItemPrice'], meta: { name: 'ItemPrice' } }
    /**
     * Find zero or one ItemPrice that matches the filter.
     * @param {ItemPriceFindUniqueArgs} args - Arguments to find a ItemPrice
     * @example
     * // Get one ItemPrice
     * const itemPrice = await prisma.itemPrice.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ItemPriceFindUniqueArgs>(args: SelectSubset<T, ItemPriceFindUniqueArgs<ExtArgs>>): Prisma__ItemPriceClient<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ItemPrice that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ItemPriceFindUniqueOrThrowArgs} args - Arguments to find a ItemPrice
     * @example
     * // Get one ItemPrice
     * const itemPrice = await prisma.itemPrice.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ItemPriceFindUniqueOrThrowArgs>(args: SelectSubset<T, ItemPriceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ItemPriceClient<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItemPrice that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPriceFindFirstArgs} args - Arguments to find a ItemPrice
     * @example
     * // Get one ItemPrice
     * const itemPrice = await prisma.itemPrice.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ItemPriceFindFirstArgs>(args?: SelectSubset<T, ItemPriceFindFirstArgs<ExtArgs>>): Prisma__ItemPriceClient<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ItemPrice that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPriceFindFirstOrThrowArgs} args - Arguments to find a ItemPrice
     * @example
     * // Get one ItemPrice
     * const itemPrice = await prisma.itemPrice.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ItemPriceFindFirstOrThrowArgs>(args?: SelectSubset<T, ItemPriceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ItemPriceClient<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ItemPrices that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPriceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ItemPrices
     * const itemPrices = await prisma.itemPrice.findMany()
     * 
     * // Get first 10 ItemPrices
     * const itemPrices = await prisma.itemPrice.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const itemPriceWithIdOnly = await prisma.itemPrice.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ItemPriceFindManyArgs>(args?: SelectSubset<T, ItemPriceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ItemPrice.
     * @param {ItemPriceCreateArgs} args - Arguments to create a ItemPrice.
     * @example
     * // Create one ItemPrice
     * const ItemPrice = await prisma.itemPrice.create({
     *   data: {
     *     // ... data to create a ItemPrice
     *   }
     * })
     * 
     */
    create<T extends ItemPriceCreateArgs>(args: SelectSubset<T, ItemPriceCreateArgs<ExtArgs>>): Prisma__ItemPriceClient<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ItemPrices.
     * @param {ItemPriceCreateManyArgs} args - Arguments to create many ItemPrices.
     * @example
     * // Create many ItemPrices
     * const itemPrice = await prisma.itemPrice.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ItemPriceCreateManyArgs>(args?: SelectSubset<T, ItemPriceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ItemPrice.
     * @param {ItemPriceDeleteArgs} args - Arguments to delete one ItemPrice.
     * @example
     * // Delete one ItemPrice
     * const ItemPrice = await prisma.itemPrice.delete({
     *   where: {
     *     // ... filter to delete one ItemPrice
     *   }
     * })
     * 
     */
    delete<T extends ItemPriceDeleteArgs>(args: SelectSubset<T, ItemPriceDeleteArgs<ExtArgs>>): Prisma__ItemPriceClient<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ItemPrice.
     * @param {ItemPriceUpdateArgs} args - Arguments to update one ItemPrice.
     * @example
     * // Update one ItemPrice
     * const itemPrice = await prisma.itemPrice.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ItemPriceUpdateArgs>(args: SelectSubset<T, ItemPriceUpdateArgs<ExtArgs>>): Prisma__ItemPriceClient<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ItemPrices.
     * @param {ItemPriceDeleteManyArgs} args - Arguments to filter ItemPrices to delete.
     * @example
     * // Delete a few ItemPrices
     * const { count } = await prisma.itemPrice.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ItemPriceDeleteManyArgs>(args?: SelectSubset<T, ItemPriceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ItemPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPriceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ItemPrices
     * const itemPrice = await prisma.itemPrice.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ItemPriceUpdateManyArgs>(args: SelectSubset<T, ItemPriceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ItemPrice.
     * @param {ItemPriceUpsertArgs} args - Arguments to update or create a ItemPrice.
     * @example
     * // Update or create a ItemPrice
     * const itemPrice = await prisma.itemPrice.upsert({
     *   create: {
     *     // ... data to create a ItemPrice
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ItemPrice we want to update
     *   }
     * })
     */
    upsert<T extends ItemPriceUpsertArgs>(args: SelectSubset<T, ItemPriceUpsertArgs<ExtArgs>>): Prisma__ItemPriceClient<$Result.GetResult<Prisma.$ItemPricePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ItemPrices.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPriceCountArgs} args - Arguments to filter ItemPrices to count.
     * @example
     * // Count the number of ItemPrices
     * const count = await prisma.itemPrice.count({
     *   where: {
     *     // ... the filter for the ItemPrices we want to count
     *   }
     * })
    **/
    count<T extends ItemPriceCountArgs>(
      args?: Subset<T, ItemPriceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ItemPriceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ItemPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPriceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ItemPriceAggregateArgs>(args: Subset<T, ItemPriceAggregateArgs>): Prisma.PrismaPromise<GetItemPriceAggregateType<T>>

    /**
     * Group by ItemPrice.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ItemPriceGroupByArgs} args - Group by arguments.
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
      T extends ItemPriceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ItemPriceGroupByArgs['orderBy'] }
        : { orderBy?: ItemPriceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ItemPriceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetItemPriceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ItemPrice model
   */
  readonly fields: ItemPriceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ItemPrice.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ItemPriceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    item<T extends ItemMasterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ItemMasterDefaultArgs<ExtArgs>>): Prisma__ItemMasterClient<$Result.GetResult<Prisma.$ItemMasterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ItemPrice model
   */
  interface ItemPriceFieldRefs {
    readonly id: FieldRef<"ItemPrice", 'Int'>
    readonly item_code: FieldRef<"ItemPrice", 'String'>
    readonly company_code: FieldRef<"ItemPrice", 'String'>
    readonly price: FieldRef<"ItemPrice", 'Decimal'>
    readonly price_group: FieldRef<"ItemPrice", 'String'>
    readonly status: FieldRef<"ItemPrice", 'String'>
    readonly created_at: FieldRef<"ItemPrice", 'DateTime'>
    readonly updated_at: FieldRef<"ItemPrice", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ItemPrice findUnique
   */
  export type ItemPriceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * Filter, which ItemPrice to fetch.
     */
    where: ItemPriceWhereUniqueInput
  }

  /**
   * ItemPrice findUniqueOrThrow
   */
  export type ItemPriceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * Filter, which ItemPrice to fetch.
     */
    where: ItemPriceWhereUniqueInput
  }

  /**
   * ItemPrice findFirst
   */
  export type ItemPriceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * Filter, which ItemPrice to fetch.
     */
    where?: ItemPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemPrices to fetch.
     */
    orderBy?: ItemPriceOrderByWithRelationInput | ItemPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemPrices.
     */
    cursor?: ItemPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemPrices.
     */
    distinct?: ItemPriceScalarFieldEnum | ItemPriceScalarFieldEnum[]
  }

  /**
   * ItemPrice findFirstOrThrow
   */
  export type ItemPriceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * Filter, which ItemPrice to fetch.
     */
    where?: ItemPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemPrices to fetch.
     */
    orderBy?: ItemPriceOrderByWithRelationInput | ItemPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ItemPrices.
     */
    cursor?: ItemPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemPrices.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ItemPrices.
     */
    distinct?: ItemPriceScalarFieldEnum | ItemPriceScalarFieldEnum[]
  }

  /**
   * ItemPrice findMany
   */
  export type ItemPriceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * Filter, which ItemPrices to fetch.
     */
    where?: ItemPriceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ItemPrices to fetch.
     */
    orderBy?: ItemPriceOrderByWithRelationInput | ItemPriceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ItemPrices.
     */
    cursor?: ItemPriceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ItemPrices from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ItemPrices.
     */
    skip?: number
    distinct?: ItemPriceScalarFieldEnum | ItemPriceScalarFieldEnum[]
  }

  /**
   * ItemPrice create
   */
  export type ItemPriceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * The data needed to create a ItemPrice.
     */
    data: XOR<ItemPriceCreateInput, ItemPriceUncheckedCreateInput>
  }

  /**
   * ItemPrice createMany
   */
  export type ItemPriceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ItemPrices.
     */
    data: ItemPriceCreateManyInput | ItemPriceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ItemPrice update
   */
  export type ItemPriceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * The data needed to update a ItemPrice.
     */
    data: XOR<ItemPriceUpdateInput, ItemPriceUncheckedUpdateInput>
    /**
     * Choose, which ItemPrice to update.
     */
    where: ItemPriceWhereUniqueInput
  }

  /**
   * ItemPrice updateMany
   */
  export type ItemPriceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ItemPrices.
     */
    data: XOR<ItemPriceUpdateManyMutationInput, ItemPriceUncheckedUpdateManyInput>
    /**
     * Filter which ItemPrices to update
     */
    where?: ItemPriceWhereInput
    /**
     * Limit how many ItemPrices to update.
     */
    limit?: number
  }

  /**
   * ItemPrice upsert
   */
  export type ItemPriceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * The filter to search for the ItemPrice to update in case it exists.
     */
    where: ItemPriceWhereUniqueInput
    /**
     * In case the ItemPrice found by the `where` argument doesn't exist, create a new ItemPrice with this data.
     */
    create: XOR<ItemPriceCreateInput, ItemPriceUncheckedCreateInput>
    /**
     * In case the ItemPrice was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ItemPriceUpdateInput, ItemPriceUncheckedUpdateInput>
  }

  /**
   * ItemPrice delete
   */
  export type ItemPriceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
    /**
     * Filter which ItemPrice to delete.
     */
    where: ItemPriceWhereUniqueInput
  }

  /**
   * ItemPrice deleteMany
   */
  export type ItemPriceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ItemPrices to delete
     */
    where?: ItemPriceWhereInput
    /**
     * Limit how many ItemPrices to delete.
     */
    limit?: number
  }

  /**
   * ItemPrice without action
   */
  export type ItemPriceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ItemPrice
     */
    select?: ItemPriceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ItemPrice
     */
    omit?: ItemPriceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ItemPriceInclude<ExtArgs> | null
  }


  /**
   * Model Physician
   */

  export type AggregatePhysician = {
    _count: PhysicianCountAggregateOutputType | null
    _avg: PhysicianAvgAggregateOutputType | null
    _sum: PhysicianSumAggregateOutputType | null
    _min: PhysicianMinAggregateOutputType | null
    _max: PhysicianMaxAggregateOutputType | null
  }

  export type PhysicianAvgAggregateOutputType = {
    id: number | null
  }

  export type PhysicianSumAggregateOutputType = {
    id: number | null
  }

  export type PhysicianMinAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    license_no: string | null
    specialty: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PhysicianMaxAggregateOutputType = {
    id: number | null
    code: string | null
    name: string | null
    license_no: string | null
    specialty: string | null
    status: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type PhysicianCountAggregateOutputType = {
    id: number
    code: number
    name: number
    license_no: number
    specialty: number
    status: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type PhysicianAvgAggregateInputType = {
    id?: true
  }

  export type PhysicianSumAggregateInputType = {
    id?: true
  }

  export type PhysicianMinAggregateInputType = {
    id?: true
    code?: true
    name?: true
    license_no?: true
    specialty?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type PhysicianMaxAggregateInputType = {
    id?: true
    code?: true
    name?: true
    license_no?: true
    specialty?: true
    status?: true
    created_at?: true
    updated_at?: true
  }

  export type PhysicianCountAggregateInputType = {
    id?: true
    code?: true
    name?: true
    license_no?: true
    specialty?: true
    status?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type PhysicianAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Physician to aggregate.
     */
    where?: PhysicianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Physicians to fetch.
     */
    orderBy?: PhysicianOrderByWithRelationInput | PhysicianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhysicianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Physicians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Physicians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Physicians
    **/
    _count?: true | PhysicianCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhysicianAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhysicianSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhysicianMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhysicianMaxAggregateInputType
  }

  export type GetPhysicianAggregateType<T extends PhysicianAggregateArgs> = {
        [P in keyof T & keyof AggregatePhysician]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhysician[P]>
      : GetScalarType<T[P], AggregatePhysician[P]>
  }




  export type PhysicianGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhysicianWhereInput
    orderBy?: PhysicianOrderByWithAggregationInput | PhysicianOrderByWithAggregationInput[]
    by: PhysicianScalarFieldEnum[] | PhysicianScalarFieldEnum
    having?: PhysicianScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhysicianCountAggregateInputType | true
    _avg?: PhysicianAvgAggregateInputType
    _sum?: PhysicianSumAggregateInputType
    _min?: PhysicianMinAggregateInputType
    _max?: PhysicianMaxAggregateInputType
  }

  export type PhysicianGroupByOutputType = {
    id: number
    code: string
    name: string
    license_no: string | null
    specialty: string | null
    status: string
    created_at: Date
    updated_at: Date
    _count: PhysicianCountAggregateOutputType | null
    _avg: PhysicianAvgAggregateOutputType | null
    _sum: PhysicianSumAggregateOutputType | null
    _min: PhysicianMinAggregateOutputType | null
    _max: PhysicianMaxAggregateOutputType | null
  }

  type GetPhysicianGroupByPayload<T extends PhysicianGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhysicianGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhysicianGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhysicianGroupByOutputType[P]>
            : GetScalarType<T[P], PhysicianGroupByOutputType[P]>
        }
      >
    >


  export type PhysicianSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    name?: boolean
    license_no?: boolean
    specialty?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["physician"]>



  export type PhysicianSelectScalar = {
    id?: boolean
    code?: boolean
    name?: boolean
    license_no?: boolean
    specialty?: boolean
    status?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type PhysicianOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "name" | "license_no" | "specialty" | "status" | "created_at" | "updated_at", ExtArgs["result"]["physician"]>

  export type $PhysicianPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Physician"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      code: string
      name: string
      license_no: string | null
      specialty: string | null
      status: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["physician"]>
    composites: {}
  }

  type PhysicianGetPayload<S extends boolean | null | undefined | PhysicianDefaultArgs> = $Result.GetResult<Prisma.$PhysicianPayload, S>

  type PhysicianCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PhysicianFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PhysicianCountAggregateInputType | true
    }

  export interface PhysicianDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Physician'], meta: { name: 'Physician' } }
    /**
     * Find zero or one Physician that matches the filter.
     * @param {PhysicianFindUniqueArgs} args - Arguments to find a Physician
     * @example
     * // Get one Physician
     * const physician = await prisma.physician.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhysicianFindUniqueArgs>(args: SelectSubset<T, PhysicianFindUniqueArgs<ExtArgs>>): Prisma__PhysicianClient<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Physician that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PhysicianFindUniqueOrThrowArgs} args - Arguments to find a Physician
     * @example
     * // Get one Physician
     * const physician = await prisma.physician.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhysicianFindUniqueOrThrowArgs>(args: SelectSubset<T, PhysicianFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhysicianClient<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Physician that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicianFindFirstArgs} args - Arguments to find a Physician
     * @example
     * // Get one Physician
     * const physician = await prisma.physician.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhysicianFindFirstArgs>(args?: SelectSubset<T, PhysicianFindFirstArgs<ExtArgs>>): Prisma__PhysicianClient<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Physician that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicianFindFirstOrThrowArgs} args - Arguments to find a Physician
     * @example
     * // Get one Physician
     * const physician = await prisma.physician.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhysicianFindFirstOrThrowArgs>(args?: SelectSubset<T, PhysicianFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhysicianClient<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Physicians that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicianFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Physicians
     * const physicians = await prisma.physician.findMany()
     * 
     * // Get first 10 Physicians
     * const physicians = await prisma.physician.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const physicianWithIdOnly = await prisma.physician.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhysicianFindManyArgs>(args?: SelectSubset<T, PhysicianFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Physician.
     * @param {PhysicianCreateArgs} args - Arguments to create a Physician.
     * @example
     * // Create one Physician
     * const Physician = await prisma.physician.create({
     *   data: {
     *     // ... data to create a Physician
     *   }
     * })
     * 
     */
    create<T extends PhysicianCreateArgs>(args: SelectSubset<T, PhysicianCreateArgs<ExtArgs>>): Prisma__PhysicianClient<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Physicians.
     * @param {PhysicianCreateManyArgs} args - Arguments to create many Physicians.
     * @example
     * // Create many Physicians
     * const physician = await prisma.physician.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhysicianCreateManyArgs>(args?: SelectSubset<T, PhysicianCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Physician.
     * @param {PhysicianDeleteArgs} args - Arguments to delete one Physician.
     * @example
     * // Delete one Physician
     * const Physician = await prisma.physician.delete({
     *   where: {
     *     // ... filter to delete one Physician
     *   }
     * })
     * 
     */
    delete<T extends PhysicianDeleteArgs>(args: SelectSubset<T, PhysicianDeleteArgs<ExtArgs>>): Prisma__PhysicianClient<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Physician.
     * @param {PhysicianUpdateArgs} args - Arguments to update one Physician.
     * @example
     * // Update one Physician
     * const physician = await prisma.physician.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhysicianUpdateArgs>(args: SelectSubset<T, PhysicianUpdateArgs<ExtArgs>>): Prisma__PhysicianClient<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Physicians.
     * @param {PhysicianDeleteManyArgs} args - Arguments to filter Physicians to delete.
     * @example
     * // Delete a few Physicians
     * const { count } = await prisma.physician.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhysicianDeleteManyArgs>(args?: SelectSubset<T, PhysicianDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Physicians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicianUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Physicians
     * const physician = await prisma.physician.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhysicianUpdateManyArgs>(args: SelectSubset<T, PhysicianUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Physician.
     * @param {PhysicianUpsertArgs} args - Arguments to update or create a Physician.
     * @example
     * // Update or create a Physician
     * const physician = await prisma.physician.upsert({
     *   create: {
     *     // ... data to create a Physician
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Physician we want to update
     *   }
     * })
     */
    upsert<T extends PhysicianUpsertArgs>(args: SelectSubset<T, PhysicianUpsertArgs<ExtArgs>>): Prisma__PhysicianClient<$Result.GetResult<Prisma.$PhysicianPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Physicians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicianCountArgs} args - Arguments to filter Physicians to count.
     * @example
     * // Count the number of Physicians
     * const count = await prisma.physician.count({
     *   where: {
     *     // ... the filter for the Physicians we want to count
     *   }
     * })
    **/
    count<T extends PhysicianCountArgs>(
      args?: Subset<T, PhysicianCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhysicianCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Physician.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicianAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PhysicianAggregateArgs>(args: Subset<T, PhysicianAggregateArgs>): Prisma.PrismaPromise<GetPhysicianAggregateType<T>>

    /**
     * Group by Physician.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhysicianGroupByArgs} args - Group by arguments.
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
      T extends PhysicianGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhysicianGroupByArgs['orderBy'] }
        : { orderBy?: PhysicianGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, PhysicianGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhysicianGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Physician model
   */
  readonly fields: PhysicianFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Physician.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhysicianClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Physician model
   */
  interface PhysicianFieldRefs {
    readonly id: FieldRef<"Physician", 'Int'>
    readonly code: FieldRef<"Physician", 'String'>
    readonly name: FieldRef<"Physician", 'String'>
    readonly license_no: FieldRef<"Physician", 'String'>
    readonly specialty: FieldRef<"Physician", 'String'>
    readonly status: FieldRef<"Physician", 'String'>
    readonly created_at: FieldRef<"Physician", 'DateTime'>
    readonly updated_at: FieldRef<"Physician", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Physician findUnique
   */
  export type PhysicianFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * Filter, which Physician to fetch.
     */
    where: PhysicianWhereUniqueInput
  }

  /**
   * Physician findUniqueOrThrow
   */
  export type PhysicianFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * Filter, which Physician to fetch.
     */
    where: PhysicianWhereUniqueInput
  }

  /**
   * Physician findFirst
   */
  export type PhysicianFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * Filter, which Physician to fetch.
     */
    where?: PhysicianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Physicians to fetch.
     */
    orderBy?: PhysicianOrderByWithRelationInput | PhysicianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Physicians.
     */
    cursor?: PhysicianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Physicians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Physicians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Physicians.
     */
    distinct?: PhysicianScalarFieldEnum | PhysicianScalarFieldEnum[]
  }

  /**
   * Physician findFirstOrThrow
   */
  export type PhysicianFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * Filter, which Physician to fetch.
     */
    where?: PhysicianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Physicians to fetch.
     */
    orderBy?: PhysicianOrderByWithRelationInput | PhysicianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Physicians.
     */
    cursor?: PhysicianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Physicians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Physicians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Physicians.
     */
    distinct?: PhysicianScalarFieldEnum | PhysicianScalarFieldEnum[]
  }

  /**
   * Physician findMany
   */
  export type PhysicianFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * Filter, which Physicians to fetch.
     */
    where?: PhysicianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Physicians to fetch.
     */
    orderBy?: PhysicianOrderByWithRelationInput | PhysicianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Physicians.
     */
    cursor?: PhysicianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Physicians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Physicians.
     */
    skip?: number
    distinct?: PhysicianScalarFieldEnum | PhysicianScalarFieldEnum[]
  }

  /**
   * Physician create
   */
  export type PhysicianCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * The data needed to create a Physician.
     */
    data: XOR<PhysicianCreateInput, PhysicianUncheckedCreateInput>
  }

  /**
   * Physician createMany
   */
  export type PhysicianCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Physicians.
     */
    data: PhysicianCreateManyInput | PhysicianCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Physician update
   */
  export type PhysicianUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * The data needed to update a Physician.
     */
    data: XOR<PhysicianUpdateInput, PhysicianUncheckedUpdateInput>
    /**
     * Choose, which Physician to update.
     */
    where: PhysicianWhereUniqueInput
  }

  /**
   * Physician updateMany
   */
  export type PhysicianUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Physicians.
     */
    data: XOR<PhysicianUpdateManyMutationInput, PhysicianUncheckedUpdateManyInput>
    /**
     * Filter which Physicians to update
     */
    where?: PhysicianWhereInput
    /**
     * Limit how many Physicians to update.
     */
    limit?: number
  }

  /**
   * Physician upsert
   */
  export type PhysicianUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * The filter to search for the Physician to update in case it exists.
     */
    where: PhysicianWhereUniqueInput
    /**
     * In case the Physician found by the `where` argument doesn't exist, create a new Physician with this data.
     */
    create: XOR<PhysicianCreateInput, PhysicianUncheckedCreateInput>
    /**
     * In case the Physician was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhysicianUpdateInput, PhysicianUncheckedUpdateInput>
  }

  /**
   * Physician delete
   */
  export type PhysicianDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
    /**
     * Filter which Physician to delete.
     */
    where: PhysicianWhereUniqueInput
  }

  /**
   * Physician deleteMany
   */
  export type PhysicianDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Physicians to delete
     */
    where?: PhysicianWhereInput
    /**
     * Limit how many Physicians to delete.
     */
    limit?: number
  }

  /**
   * Physician without action
   */
  export type PhysicianDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Physician
     */
    select?: PhysicianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Physician
     */
    omit?: PhysicianOmit<ExtArgs> | null
  }


  /**
   * Model HL7Message
   */

  export type AggregateHL7Message = {
    _count: HL7MessageCountAggregateOutputType | null
    _avg: HL7MessageAvgAggregateOutputType | null
    _sum: HL7MessageSumAggregateOutputType | null
    _min: HL7MessageMinAggregateOutputType | null
    _max: HL7MessageMaxAggregateOutputType | null
  }

  export type HL7MessageAvgAggregateOutputType = {
    id: number | null
  }

  export type HL7MessageSumAggregateOutputType = {
    id: number | null
  }

  export type HL7MessageMinAggregateOutputType = {
    id: number | null
    facility_code: string | null
    message_type: string | null
    accession_no: string | null
    patient_id: string | null
    status: string | null
    raw_message: string | null
    error_message: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type HL7MessageMaxAggregateOutputType = {
    id: number | null
    facility_code: string | null
    message_type: string | null
    accession_no: string | null
    patient_id: string | null
    status: string | null
    raw_message: string | null
    error_message: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type HL7MessageCountAggregateOutputType = {
    id: number
    facility_code: number
    message_type: number
    accession_no: number
    patient_id: number
    status: number
    raw_message: number
    error_message: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type HL7MessageAvgAggregateInputType = {
    id?: true
  }

  export type HL7MessageSumAggregateInputType = {
    id?: true
  }

  export type HL7MessageMinAggregateInputType = {
    id?: true
    facility_code?: true
    message_type?: true
    accession_no?: true
    patient_id?: true
    status?: true
    raw_message?: true
    error_message?: true
    created_at?: true
    updated_at?: true
  }

  export type HL7MessageMaxAggregateInputType = {
    id?: true
    facility_code?: true
    message_type?: true
    accession_no?: true
    patient_id?: true
    status?: true
    raw_message?: true
    error_message?: true
    created_at?: true
    updated_at?: true
  }

  export type HL7MessageCountAggregateInputType = {
    id?: true
    facility_code?: true
    message_type?: true
    accession_no?: true
    patient_id?: true
    status?: true
    raw_message?: true
    error_message?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type HL7MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HL7Message to aggregate.
     */
    where?: HL7MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HL7Messages to fetch.
     */
    orderBy?: HL7MessageOrderByWithRelationInput | HL7MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HL7MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HL7Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HL7Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned HL7Messages
    **/
    _count?: true | HL7MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HL7MessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HL7MessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HL7MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HL7MessageMaxAggregateInputType
  }

  export type GetHL7MessageAggregateType<T extends HL7MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateHL7Message]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHL7Message[P]>
      : GetScalarType<T[P], AggregateHL7Message[P]>
  }




  export type HL7MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HL7MessageWhereInput
    orderBy?: HL7MessageOrderByWithAggregationInput | HL7MessageOrderByWithAggregationInput[]
    by: HL7MessageScalarFieldEnum[] | HL7MessageScalarFieldEnum
    having?: HL7MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HL7MessageCountAggregateInputType | true
    _avg?: HL7MessageAvgAggregateInputType
    _sum?: HL7MessageSumAggregateInputType
    _min?: HL7MessageMinAggregateInputType
    _max?: HL7MessageMaxAggregateInputType
  }

  export type HL7MessageGroupByOutputType = {
    id: number
    facility_code: string
    message_type: string
    accession_no: string | null
    patient_id: string | null
    status: string
    raw_message: string | null
    error_message: string | null
    created_at: Date
    updated_at: Date
    _count: HL7MessageCountAggregateOutputType | null
    _avg: HL7MessageAvgAggregateOutputType | null
    _sum: HL7MessageSumAggregateOutputType | null
    _min: HL7MessageMinAggregateOutputType | null
    _max: HL7MessageMaxAggregateOutputType | null
  }

  type GetHL7MessageGroupByPayload<T extends HL7MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HL7MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HL7MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HL7MessageGroupByOutputType[P]>
            : GetScalarType<T[P], HL7MessageGroupByOutputType[P]>
        }
      >
    >


  export type HL7MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    facility_code?: boolean
    message_type?: boolean
    accession_no?: boolean
    patient_id?: boolean
    status?: boolean
    raw_message?: boolean
    error_message?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["hL7Message"]>



  export type HL7MessageSelectScalar = {
    id?: boolean
    facility_code?: boolean
    message_type?: boolean
    accession_no?: boolean
    patient_id?: boolean
    status?: boolean
    raw_message?: boolean
    error_message?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type HL7MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "facility_code" | "message_type" | "accession_no" | "patient_id" | "status" | "raw_message" | "error_message" | "created_at" | "updated_at", ExtArgs["result"]["hL7Message"]>

  export type $HL7MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "HL7Message"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      facility_code: string
      message_type: string
      accession_no: string | null
      patient_id: string | null
      status: string
      raw_message: string | null
      error_message: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["hL7Message"]>
    composites: {}
  }

  type HL7MessageGetPayload<S extends boolean | null | undefined | HL7MessageDefaultArgs> = $Result.GetResult<Prisma.$HL7MessagePayload, S>

  type HL7MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HL7MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HL7MessageCountAggregateInputType | true
    }

  export interface HL7MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['HL7Message'], meta: { name: 'HL7Message' } }
    /**
     * Find zero or one HL7Message that matches the filter.
     * @param {HL7MessageFindUniqueArgs} args - Arguments to find a HL7Message
     * @example
     * // Get one HL7Message
     * const hL7Message = await prisma.hL7Message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HL7MessageFindUniqueArgs>(args: SelectSubset<T, HL7MessageFindUniqueArgs<ExtArgs>>): Prisma__HL7MessageClient<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one HL7Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HL7MessageFindUniqueOrThrowArgs} args - Arguments to find a HL7Message
     * @example
     * // Get one HL7Message
     * const hL7Message = await prisma.hL7Message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HL7MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, HL7MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HL7MessageClient<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HL7Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HL7MessageFindFirstArgs} args - Arguments to find a HL7Message
     * @example
     * // Get one HL7Message
     * const hL7Message = await prisma.hL7Message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HL7MessageFindFirstArgs>(args?: SelectSubset<T, HL7MessageFindFirstArgs<ExtArgs>>): Prisma__HL7MessageClient<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first HL7Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HL7MessageFindFirstOrThrowArgs} args - Arguments to find a HL7Message
     * @example
     * // Get one HL7Message
     * const hL7Message = await prisma.hL7Message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HL7MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, HL7MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__HL7MessageClient<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more HL7Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HL7MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all HL7Messages
     * const hL7Messages = await prisma.hL7Message.findMany()
     * 
     * // Get first 10 HL7Messages
     * const hL7Messages = await prisma.hL7Message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hL7MessageWithIdOnly = await prisma.hL7Message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HL7MessageFindManyArgs>(args?: SelectSubset<T, HL7MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a HL7Message.
     * @param {HL7MessageCreateArgs} args - Arguments to create a HL7Message.
     * @example
     * // Create one HL7Message
     * const HL7Message = await prisma.hL7Message.create({
     *   data: {
     *     // ... data to create a HL7Message
     *   }
     * })
     * 
     */
    create<T extends HL7MessageCreateArgs>(args: SelectSubset<T, HL7MessageCreateArgs<ExtArgs>>): Prisma__HL7MessageClient<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many HL7Messages.
     * @param {HL7MessageCreateManyArgs} args - Arguments to create many HL7Messages.
     * @example
     * // Create many HL7Messages
     * const hL7Message = await prisma.hL7Message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HL7MessageCreateManyArgs>(args?: SelectSubset<T, HL7MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a HL7Message.
     * @param {HL7MessageDeleteArgs} args - Arguments to delete one HL7Message.
     * @example
     * // Delete one HL7Message
     * const HL7Message = await prisma.hL7Message.delete({
     *   where: {
     *     // ... filter to delete one HL7Message
     *   }
     * })
     * 
     */
    delete<T extends HL7MessageDeleteArgs>(args: SelectSubset<T, HL7MessageDeleteArgs<ExtArgs>>): Prisma__HL7MessageClient<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one HL7Message.
     * @param {HL7MessageUpdateArgs} args - Arguments to update one HL7Message.
     * @example
     * // Update one HL7Message
     * const hL7Message = await prisma.hL7Message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HL7MessageUpdateArgs>(args: SelectSubset<T, HL7MessageUpdateArgs<ExtArgs>>): Prisma__HL7MessageClient<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more HL7Messages.
     * @param {HL7MessageDeleteManyArgs} args - Arguments to filter HL7Messages to delete.
     * @example
     * // Delete a few HL7Messages
     * const { count } = await prisma.hL7Message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HL7MessageDeleteManyArgs>(args?: SelectSubset<T, HL7MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more HL7Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HL7MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many HL7Messages
     * const hL7Message = await prisma.hL7Message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HL7MessageUpdateManyArgs>(args: SelectSubset<T, HL7MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one HL7Message.
     * @param {HL7MessageUpsertArgs} args - Arguments to update or create a HL7Message.
     * @example
     * // Update or create a HL7Message
     * const hL7Message = await prisma.hL7Message.upsert({
     *   create: {
     *     // ... data to create a HL7Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the HL7Message we want to update
     *   }
     * })
     */
    upsert<T extends HL7MessageUpsertArgs>(args: SelectSubset<T, HL7MessageUpsertArgs<ExtArgs>>): Prisma__HL7MessageClient<$Result.GetResult<Prisma.$HL7MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of HL7Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HL7MessageCountArgs} args - Arguments to filter HL7Messages to count.
     * @example
     * // Count the number of HL7Messages
     * const count = await prisma.hL7Message.count({
     *   where: {
     *     // ... the filter for the HL7Messages we want to count
     *   }
     * })
    **/
    count<T extends HL7MessageCountArgs>(
      args?: Subset<T, HL7MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HL7MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a HL7Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HL7MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends HL7MessageAggregateArgs>(args: Subset<T, HL7MessageAggregateArgs>): Prisma.PrismaPromise<GetHL7MessageAggregateType<T>>

    /**
     * Group by HL7Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HL7MessageGroupByArgs} args - Group by arguments.
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
      T extends HL7MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HL7MessageGroupByArgs['orderBy'] }
        : { orderBy?: HL7MessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, HL7MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHL7MessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the HL7Message model
   */
  readonly fields: HL7MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for HL7Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HL7MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the HL7Message model
   */
  interface HL7MessageFieldRefs {
    readonly id: FieldRef<"HL7Message", 'Int'>
    readonly facility_code: FieldRef<"HL7Message", 'String'>
    readonly message_type: FieldRef<"HL7Message", 'String'>
    readonly accession_no: FieldRef<"HL7Message", 'String'>
    readonly patient_id: FieldRef<"HL7Message", 'String'>
    readonly status: FieldRef<"HL7Message", 'String'>
    readonly raw_message: FieldRef<"HL7Message", 'String'>
    readonly error_message: FieldRef<"HL7Message", 'String'>
    readonly created_at: FieldRef<"HL7Message", 'DateTime'>
    readonly updated_at: FieldRef<"HL7Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * HL7Message findUnique
   */
  export type HL7MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * Filter, which HL7Message to fetch.
     */
    where: HL7MessageWhereUniqueInput
  }

  /**
   * HL7Message findUniqueOrThrow
   */
  export type HL7MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * Filter, which HL7Message to fetch.
     */
    where: HL7MessageWhereUniqueInput
  }

  /**
   * HL7Message findFirst
   */
  export type HL7MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * Filter, which HL7Message to fetch.
     */
    where?: HL7MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HL7Messages to fetch.
     */
    orderBy?: HL7MessageOrderByWithRelationInput | HL7MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HL7Messages.
     */
    cursor?: HL7MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HL7Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HL7Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HL7Messages.
     */
    distinct?: HL7MessageScalarFieldEnum | HL7MessageScalarFieldEnum[]
  }

  /**
   * HL7Message findFirstOrThrow
   */
  export type HL7MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * Filter, which HL7Message to fetch.
     */
    where?: HL7MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HL7Messages to fetch.
     */
    orderBy?: HL7MessageOrderByWithRelationInput | HL7MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for HL7Messages.
     */
    cursor?: HL7MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HL7Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HL7Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of HL7Messages.
     */
    distinct?: HL7MessageScalarFieldEnum | HL7MessageScalarFieldEnum[]
  }

  /**
   * HL7Message findMany
   */
  export type HL7MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * Filter, which HL7Messages to fetch.
     */
    where?: HL7MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of HL7Messages to fetch.
     */
    orderBy?: HL7MessageOrderByWithRelationInput | HL7MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing HL7Messages.
     */
    cursor?: HL7MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` HL7Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` HL7Messages.
     */
    skip?: number
    distinct?: HL7MessageScalarFieldEnum | HL7MessageScalarFieldEnum[]
  }

  /**
   * HL7Message create
   */
  export type HL7MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * The data needed to create a HL7Message.
     */
    data: XOR<HL7MessageCreateInput, HL7MessageUncheckedCreateInput>
  }

  /**
   * HL7Message createMany
   */
  export type HL7MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many HL7Messages.
     */
    data: HL7MessageCreateManyInput | HL7MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * HL7Message update
   */
  export type HL7MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * The data needed to update a HL7Message.
     */
    data: XOR<HL7MessageUpdateInput, HL7MessageUncheckedUpdateInput>
    /**
     * Choose, which HL7Message to update.
     */
    where: HL7MessageWhereUniqueInput
  }

  /**
   * HL7Message updateMany
   */
  export type HL7MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update HL7Messages.
     */
    data: XOR<HL7MessageUpdateManyMutationInput, HL7MessageUncheckedUpdateManyInput>
    /**
     * Filter which HL7Messages to update
     */
    where?: HL7MessageWhereInput
    /**
     * Limit how many HL7Messages to update.
     */
    limit?: number
  }

  /**
   * HL7Message upsert
   */
  export type HL7MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * The filter to search for the HL7Message to update in case it exists.
     */
    where: HL7MessageWhereUniqueInput
    /**
     * In case the HL7Message found by the `where` argument doesn't exist, create a new HL7Message with this data.
     */
    create: XOR<HL7MessageCreateInput, HL7MessageUncheckedCreateInput>
    /**
     * In case the HL7Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HL7MessageUpdateInput, HL7MessageUncheckedUpdateInput>
  }

  /**
   * HL7Message delete
   */
  export type HL7MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
    /**
     * Filter which HL7Message to delete.
     */
    where: HL7MessageWhereUniqueInput
  }

  /**
   * HL7Message deleteMany
   */
  export type HL7MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which HL7Messages to delete
     */
    where?: HL7MessageWhereInput
    /**
     * Limit how many HL7Messages to delete.
     */
    limit?: number
  }

  /**
   * HL7Message without action
   */
  export type HL7MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HL7Message
     */
    select?: HL7MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the HL7Message
     */
    omit?: HL7MessageOmit<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleAvgAggregateOutputType = {
    id: number | null
  }

  export type RoleSumAggregateOutputType = {
    id: number | null
  }

  export type RoleMinAggregateOutputType = {
    id: number | null
    ldap_role: string | null
    module: string | null
    tab: string | null
    description: string | null
  }

  export type RoleMaxAggregateOutputType = {
    id: number | null
    ldap_role: string | null
    module: string | null
    tab: string | null
    description: string | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    ldap_role: number
    module: number
    tab: number
    description: number
    _all: number
  }


  export type RoleAvgAggregateInputType = {
    id?: true
  }

  export type RoleSumAggregateInputType = {
    id?: true
  }

  export type RoleMinAggregateInputType = {
    id?: true
    ldap_role?: true
    module?: true
    tab?: true
    description?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    ldap_role?: true
    module?: true
    tab?: true
    description?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    ldap_role?: true
    module?: true
    tab?: true
    description?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _avg?: RoleAvgAggregateInputType
    _sum?: RoleSumAggregateInputType
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: number
    ldap_role: string
    module: string
    tab: string
    description: string | null
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    ldap_role?: boolean
    module?: boolean
    tab?: boolean
    description?: boolean
  }, ExtArgs["result"]["role"]>



  export type RoleSelectScalar = {
    id?: boolean
    ldap_role?: boolean
    module?: boolean
    tab?: boolean
    description?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "ldap_role" | "module" | "tab" | "description", ExtArgs["result"]["role"]>

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      ldap_role: string
      module: string
      tab: string
      description: string | null
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
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
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'Int'>
    readonly ldap_role: FieldRef<"Role", 'String'>
    readonly module: FieldRef<"Role", 'String'>
    readonly tab: FieldRef<"Role", 'String'>
    readonly description: FieldRef<"Role", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
  }


  /**
   * Model Setting
   */

  export type AggregateSetting = {
    _count: SettingCountAggregateOutputType | null
    _avg: SettingAvgAggregateOutputType | null
    _sum: SettingSumAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  export type SettingAvgAggregateOutputType = {
    id: number | null
  }

  export type SettingSumAggregateOutputType = {
    id: number | null
  }

  export type SettingMinAggregateOutputType = {
    id: number | null
    key: string | null
    value: string | null
  }

  export type SettingMaxAggregateOutputType = {
    id: number | null
    key: string | null
    value: string | null
  }

  export type SettingCountAggregateOutputType = {
    id: number
    key: number
    value: number
    _all: number
  }


  export type SettingAvgAggregateInputType = {
    id?: true
  }

  export type SettingSumAggregateInputType = {
    id?: true
  }

  export type SettingMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
  }

  export type SettingMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
  }

  export type SettingCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    _all?: true
  }

  export type SettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Setting to aggregate.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingMaxAggregateInputType
  }

  export type GetSettingAggregateType<T extends SettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSetting[P]>
      : GetScalarType<T[P], AggregateSetting[P]>
  }




  export type SettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingWhereInput
    orderBy?: SettingOrderByWithAggregationInput | SettingOrderByWithAggregationInput[]
    by: SettingScalarFieldEnum[] | SettingScalarFieldEnum
    having?: SettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingCountAggregateInputType | true
    _avg?: SettingAvgAggregateInputType
    _sum?: SettingSumAggregateInputType
    _min?: SettingMinAggregateInputType
    _max?: SettingMaxAggregateInputType
  }

  export type SettingGroupByOutputType = {
    id: number
    key: string
    value: string
    _count: SettingCountAggregateOutputType | null
    _avg: SettingAvgAggregateOutputType | null
    _sum: SettingSumAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  type GetSettingGroupByPayload<T extends SettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingGroupByOutputType[P]>
            : GetScalarType<T[P], SettingGroupByOutputType[P]>
        }
      >
    >


  export type SettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
  }, ExtArgs["result"]["setting"]>



  export type SettingSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
  }

  export type SettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value", ExtArgs["result"]["setting"]>

  export type $SettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Setting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      key: string
      value: string
    }, ExtArgs["result"]["setting"]>
    composites: {}
  }

  type SettingGetPayload<S extends boolean | null | undefined | SettingDefaultArgs> = $Result.GetResult<Prisma.$SettingPayload, S>

  type SettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SettingCountAggregateInputType | true
    }

  export interface SettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Setting'], meta: { name: 'Setting' } }
    /**
     * Find zero or one Setting that matches the filter.
     * @param {SettingFindUniqueArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingFindUniqueArgs>(args: SelectSubset<T, SettingFindUniqueArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Setting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettingFindUniqueOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingFindFirstArgs>(args?: SelectSubset<T, SettingFindFirstArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.setting.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.setting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingWithIdOnly = await prisma.setting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingFindManyArgs>(args?: SelectSubset<T, SettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Setting.
     * @param {SettingCreateArgs} args - Arguments to create a Setting.
     * @example
     * // Create one Setting
     * const Setting = await prisma.setting.create({
     *   data: {
     *     // ... data to create a Setting
     *   }
     * })
     * 
     */
    create<T extends SettingCreateArgs>(args: SelectSubset<T, SettingCreateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Settings.
     * @param {SettingCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingCreateManyArgs>(args?: SelectSubset<T, SettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Setting.
     * @param {SettingDeleteArgs} args - Arguments to delete one Setting.
     * @example
     * // Delete one Setting
     * const Setting = await prisma.setting.delete({
     *   where: {
     *     // ... filter to delete one Setting
     *   }
     * })
     * 
     */
    delete<T extends SettingDeleteArgs>(args: SelectSubset<T, SettingDeleteArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Setting.
     * @param {SettingUpdateArgs} args - Arguments to update one Setting.
     * @example
     * // Update one Setting
     * const setting = await prisma.setting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingUpdateArgs>(args: SelectSubset<T, SettingUpdateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Settings.
     * @param {SettingDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.setting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingDeleteManyArgs>(args?: SelectSubset<T, SettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingUpdateManyArgs>(args: SelectSubset<T, SettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Setting.
     * @param {SettingUpsertArgs} args - Arguments to update or create a Setting.
     * @example
     * // Update or create a Setting
     * const setting = await prisma.setting.upsert({
     *   create: {
     *     // ... data to create a Setting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Setting we want to update
     *   }
     * })
     */
    upsert<T extends SettingUpsertArgs>(args: SelectSubset<T, SettingUpsertArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.setting.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingCountArgs>(
      args?: Subset<T, SettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SettingAggregateArgs>(args: Subset<T, SettingAggregateArgs>): Prisma.PrismaPromise<GetSettingAggregateType<T>>

    /**
     * Group by Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingGroupByArgs} args - Group by arguments.
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
      T extends SettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingGroupByArgs['orderBy'] }
        : { orderBy?: SettingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Setting model
   */
  readonly fields: SettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Setting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Setting model
   */
  interface SettingFieldRefs {
    readonly id: FieldRef<"Setting", 'Int'>
    readonly key: FieldRef<"Setting", 'String'>
    readonly value: FieldRef<"Setting", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Setting findUnique
   */
  export type SettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findUniqueOrThrow
   */
  export type SettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findFirst
   */
  export type SettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findFirstOrThrow
   */
  export type SettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findMany
   */
  export type SettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting create
   */
  export type SettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data needed to create a Setting.
     */
    data: XOR<SettingCreateInput, SettingUncheckedCreateInput>
  }

  /**
   * Setting createMany
   */
  export type SettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Setting update
   */
  export type SettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data needed to update a Setting.
     */
    data: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
    /**
     * Choose, which Setting to update.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting updateMany
   */
  export type SettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Setting upsert
   */
  export type SettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The filter to search for the Setting to update in case it exists.
     */
    where: SettingWhereUniqueInput
    /**
     * In case the Setting found by the `where` argument doesn't exist, create a new Setting with this data.
     */
    create: XOR<SettingCreateInput, SettingUncheckedCreateInput>
    /**
     * In case the Setting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
  }

  /**
   * Setting delete
   */
  export type SettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Filter which Setting to delete.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting deleteMany
   */
  export type SettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to delete.
     */
    limit?: number
  }

  /**
   * Setting without action
   */
  export type SettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
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
    username: 'username',
    email: 'email',
    password: 'password',
    first_name: 'first_name',
    last_name: 'last_name',
    department: 'department',
    role: 'role',
    activated: 'activated',
    ldap_import: 'ldap_import',
    deleted_at: 'deleted_at',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const QueueScalarFieldEnum: {
    id: 'id',
    patient_id: 'patient_id',
    patient_name: 'patient_name',
    company_code: 'company_code',
    company_name: 'company_name',
    queue_number: 'queue_number',
    status: 'status',
    priority: 'priority',
    clinic_code: 'clinic_code',
    created_by: 'created_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type QueueScalarFieldEnum = (typeof QueueScalarFieldEnum)[keyof typeof QueueScalarFieldEnum]


  export const CardEnrollmentScalarFieldEnum: {
    id: 'id',
    card_number: 'card_number',
    patient_id: 'patient_id',
    patient_name: 'patient_name',
    status: 'status',
    registered_by: 'registered_by',
    registered_at: 'registered_at',
    received_by: 'received_by',
    received_at: 'received_at',
    verified_by: 'verified_by',
    verified_at: 'verified_at',
    transferred_to: 'transferred_to',
    transferred_at: 'transferred_at',
    clinic_code: 'clinic_code',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CardEnrollmentScalarFieldEnum = (typeof CardEnrollmentScalarFieldEnum)[keyof typeof CardEnrollmentScalarFieldEnum]


  export const CardNumberScalarFieldEnum: {
    id: 'id',
    card_number: 'card_number',
    barcode: 'barcode',
    is_used: 'is_used',
    created_at: 'created_at'
  };

  export type CardNumberScalarFieldEnum = (typeof CardNumberScalarFieldEnum)[keyof typeof CardNumberScalarFieldEnum]


  export const PaymentHistoryScalarFieldEnum: {
    id: 'id',
    patient_id: 'patient_id',
    queue_id: 'queue_id',
    amount: 'amount',
    payment_method: 'payment_method',
    status: 'status',
    transaction_no: 'transaction_no',
    or_no: 'or_no',
    clinic_code: 'clinic_code',
    created_by: 'created_by',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type PaymentHistoryScalarFieldEnum = (typeof PaymentHistoryScalarFieldEnum)[keyof typeof PaymentHistoryScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    transaction_no: 'transaction_no',
    patient_id: 'patient_id',
    type: 'type',
    amount: 'amount',
    description: 'description',
    clinic_code: 'clinic_code',
    created_by: 'created_by',
    created_at: 'created_at'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const CompanyScalarFieldEnum: {
    id: 'id',
    eros_code: 'eros_code',
    name: 'name',
    address: 'address',
    contact: 'contact',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const ItemMasterScalarFieldEnum: {
    id: 'id',
    item_code: 'item_code',
    item_name: 'item_name',
    category: 'category',
    department: 'department',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ItemMasterScalarFieldEnum = (typeof ItemMasterScalarFieldEnum)[keyof typeof ItemMasterScalarFieldEnum]


  export const ItemPriceScalarFieldEnum: {
    id: 'id',
    item_code: 'item_code',
    company_code: 'company_code',
    price: 'price',
    price_group: 'price_group',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type ItemPriceScalarFieldEnum = (typeof ItemPriceScalarFieldEnum)[keyof typeof ItemPriceScalarFieldEnum]


  export const PhysicianScalarFieldEnum: {
    id: 'id',
    code: 'code',
    name: 'name',
    license_no: 'license_no',
    specialty: 'specialty',
    status: 'status',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type PhysicianScalarFieldEnum = (typeof PhysicianScalarFieldEnum)[keyof typeof PhysicianScalarFieldEnum]


  export const HL7MessageScalarFieldEnum: {
    id: 'id',
    facility_code: 'facility_code',
    message_type: 'message_type',
    accession_no: 'accession_no',
    patient_id: 'patient_id',
    status: 'status',
    raw_message: 'raw_message',
    error_message: 'error_message',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type HL7MessageScalarFieldEnum = (typeof HL7MessageScalarFieldEnum)[keyof typeof HL7MessageScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    ldap_role: 'ldap_role',
    module: 'module',
    tab: 'tab',
    description: 'description'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const SettingScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value'
  };

  export type SettingScalarFieldEnum = (typeof SettingScalarFieldEnum)[keyof typeof SettingScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const UserOrderByRelevanceFieldEnum: {
    username: 'username',
    email: 'email',
    password: 'password',
    first_name: 'first_name',
    last_name: 'last_name',
    department: 'department',
    role: 'role'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const QueueOrderByRelevanceFieldEnum: {
    patient_id: 'patient_id',
    patient_name: 'patient_name',
    company_code: 'company_code',
    company_name: 'company_name',
    status: 'status',
    clinic_code: 'clinic_code'
  };

  export type QueueOrderByRelevanceFieldEnum = (typeof QueueOrderByRelevanceFieldEnum)[keyof typeof QueueOrderByRelevanceFieldEnum]


  export const CardEnrollmentOrderByRelevanceFieldEnum: {
    card_number: 'card_number',
    patient_id: 'patient_id',
    patient_name: 'patient_name',
    status: 'status',
    registered_by: 'registered_by',
    received_by: 'received_by',
    verified_by: 'verified_by',
    transferred_to: 'transferred_to',
    clinic_code: 'clinic_code'
  };

  export type CardEnrollmentOrderByRelevanceFieldEnum = (typeof CardEnrollmentOrderByRelevanceFieldEnum)[keyof typeof CardEnrollmentOrderByRelevanceFieldEnum]


  export const CardNumberOrderByRelevanceFieldEnum: {
    card_number: 'card_number',
    barcode: 'barcode'
  };

  export type CardNumberOrderByRelevanceFieldEnum = (typeof CardNumberOrderByRelevanceFieldEnum)[keyof typeof CardNumberOrderByRelevanceFieldEnum]


  export const PaymentHistoryOrderByRelevanceFieldEnum: {
    patient_id: 'patient_id',
    payment_method: 'payment_method',
    status: 'status',
    transaction_no: 'transaction_no',
    or_no: 'or_no',
    clinic_code: 'clinic_code'
  };

  export type PaymentHistoryOrderByRelevanceFieldEnum = (typeof PaymentHistoryOrderByRelevanceFieldEnum)[keyof typeof PaymentHistoryOrderByRelevanceFieldEnum]


  export const TransactionOrderByRelevanceFieldEnum: {
    transaction_no: 'transaction_no',
    patient_id: 'patient_id',
    type: 'type',
    description: 'description',
    clinic_code: 'clinic_code'
  };

  export type TransactionOrderByRelevanceFieldEnum = (typeof TransactionOrderByRelevanceFieldEnum)[keyof typeof TransactionOrderByRelevanceFieldEnum]


  export const CompanyOrderByRelevanceFieldEnum: {
    eros_code: 'eros_code',
    name: 'name',
    address: 'address',
    contact: 'contact',
    status: 'status'
  };

  export type CompanyOrderByRelevanceFieldEnum = (typeof CompanyOrderByRelevanceFieldEnum)[keyof typeof CompanyOrderByRelevanceFieldEnum]


  export const ItemMasterOrderByRelevanceFieldEnum: {
    item_code: 'item_code',
    item_name: 'item_name',
    category: 'category',
    department: 'department',
    status: 'status'
  };

  export type ItemMasterOrderByRelevanceFieldEnum = (typeof ItemMasterOrderByRelevanceFieldEnum)[keyof typeof ItemMasterOrderByRelevanceFieldEnum]


  export const ItemPriceOrderByRelevanceFieldEnum: {
    item_code: 'item_code',
    company_code: 'company_code',
    price_group: 'price_group',
    status: 'status'
  };

  export type ItemPriceOrderByRelevanceFieldEnum = (typeof ItemPriceOrderByRelevanceFieldEnum)[keyof typeof ItemPriceOrderByRelevanceFieldEnum]


  export const PhysicianOrderByRelevanceFieldEnum: {
    code: 'code',
    name: 'name',
    license_no: 'license_no',
    specialty: 'specialty',
    status: 'status'
  };

  export type PhysicianOrderByRelevanceFieldEnum = (typeof PhysicianOrderByRelevanceFieldEnum)[keyof typeof PhysicianOrderByRelevanceFieldEnum]


  export const HL7MessageOrderByRelevanceFieldEnum: {
    facility_code: 'facility_code',
    message_type: 'message_type',
    accession_no: 'accession_no',
    patient_id: 'patient_id',
    status: 'status',
    raw_message: 'raw_message',
    error_message: 'error_message'
  };

  export type HL7MessageOrderByRelevanceFieldEnum = (typeof HL7MessageOrderByRelevanceFieldEnum)[keyof typeof HL7MessageOrderByRelevanceFieldEnum]


  export const RoleOrderByRelevanceFieldEnum: {
    ldap_role: 'ldap_role',
    module: 'module',
    tab: 'tab',
    description: 'description'
  };

  export type RoleOrderByRelevanceFieldEnum = (typeof RoleOrderByRelevanceFieldEnum)[keyof typeof RoleOrderByRelevanceFieldEnum]


  export const SettingOrderByRelevanceFieldEnum: {
    key: 'key',
    value: 'value'
  };

  export type SettingOrderByRelevanceFieldEnum = (typeof SettingOrderByRelevanceFieldEnum)[keyof typeof SettingOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    username?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    first_name?: StringNullableFilter<"User"> | string | null
    last_name?: StringNullableFilter<"User"> | string | null
    department?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    activated?: IntFilter<"User"> | number
    ldap_import?: IntFilter<"User"> | number
    deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    queues?: QueueListRelationFilter
    payments?: PaymentHistoryListRelationFilter
    transactions?: TransactionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrder
    first_name?: SortOrderInput | SortOrder
    last_name?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    activated?: SortOrder
    ldap_import?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    queues?: QueueOrderByRelationAggregateInput
    payments?: PaymentHistoryOrderByRelationAggregateInput
    transactions?: TransactionOrderByRelationAggregateInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    email?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    first_name?: StringNullableFilter<"User"> | string | null
    last_name?: StringNullableFilter<"User"> | string | null
    department?: StringNullableFilter<"User"> | string | null
    role?: StringNullableFilter<"User"> | string | null
    activated?: IntFilter<"User"> | number
    ldap_import?: IntFilter<"User"> | number
    deleted_at?: DateTimeNullableFilter<"User"> | Date | string | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    queues?: QueueListRelationFilter
    payments?: PaymentHistoryListRelationFilter
    transactions?: TransactionListRelationFilter
  }, "id" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    password?: SortOrder
    first_name?: SortOrderInput | SortOrder
    last_name?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    role?: SortOrderInput | SortOrder
    activated?: SortOrder
    ldap_import?: SortOrder
    deleted_at?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
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
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    first_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    last_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    department?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: StringNullableWithAggregatesFilter<"User"> | string | null
    activated?: IntWithAggregatesFilter<"User"> | number
    ldap_import?: IntWithAggregatesFilter<"User"> | number
    deleted_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type QueueWhereInput = {
    AND?: QueueWhereInput | QueueWhereInput[]
    OR?: QueueWhereInput[]
    NOT?: QueueWhereInput | QueueWhereInput[]
    id?: IntFilter<"Queue"> | number
    patient_id?: StringFilter<"Queue"> | string
    patient_name?: StringFilter<"Queue"> | string
    company_code?: StringNullableFilter<"Queue"> | string | null
    company_name?: StringNullableFilter<"Queue"> | string | null
    queue_number?: IntFilter<"Queue"> | number
    status?: StringFilter<"Queue"> | string
    priority?: IntFilter<"Queue"> | number
    clinic_code?: StringNullableFilter<"Queue"> | string | null
    created_by?: IntNullableFilter<"Queue"> | number | null
    created_at?: DateTimeFilter<"Queue"> | Date | string
    updated_at?: DateTimeFilter<"Queue"> | Date | string
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    payments?: PaymentHistoryListRelationFilter
  }

  export type QueueOrderByWithRelationInput = {
    id?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrder
    company_code?: SortOrderInput | SortOrder
    company_name?: SortOrderInput | SortOrder
    queue_number?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinic_code?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    creator?: UserOrderByWithRelationInput
    payments?: PaymentHistoryOrderByRelationAggregateInput
    _relevance?: QueueOrderByRelevanceInput
  }

  export type QueueWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: QueueWhereInput | QueueWhereInput[]
    OR?: QueueWhereInput[]
    NOT?: QueueWhereInput | QueueWhereInput[]
    patient_id?: StringFilter<"Queue"> | string
    patient_name?: StringFilter<"Queue"> | string
    company_code?: StringNullableFilter<"Queue"> | string | null
    company_name?: StringNullableFilter<"Queue"> | string | null
    queue_number?: IntFilter<"Queue"> | number
    status?: StringFilter<"Queue"> | string
    priority?: IntFilter<"Queue"> | number
    clinic_code?: StringNullableFilter<"Queue"> | string | null
    created_by?: IntNullableFilter<"Queue"> | number | null
    created_at?: DateTimeFilter<"Queue"> | Date | string
    updated_at?: DateTimeFilter<"Queue"> | Date | string
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    payments?: PaymentHistoryListRelationFilter
  }, "id">

  export type QueueOrderByWithAggregationInput = {
    id?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrder
    company_code?: SortOrderInput | SortOrder
    company_name?: SortOrderInput | SortOrder
    queue_number?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinic_code?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
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
    id?: IntWithAggregatesFilter<"Queue"> | number
    patient_id?: StringWithAggregatesFilter<"Queue"> | string
    patient_name?: StringWithAggregatesFilter<"Queue"> | string
    company_code?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    company_name?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    queue_number?: IntWithAggregatesFilter<"Queue"> | number
    status?: StringWithAggregatesFilter<"Queue"> | string
    priority?: IntWithAggregatesFilter<"Queue"> | number
    clinic_code?: StringNullableWithAggregatesFilter<"Queue"> | string | null
    created_by?: IntNullableWithAggregatesFilter<"Queue"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"Queue"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Queue"> | Date | string
  }

  export type CardEnrollmentWhereInput = {
    AND?: CardEnrollmentWhereInput | CardEnrollmentWhereInput[]
    OR?: CardEnrollmentWhereInput[]
    NOT?: CardEnrollmentWhereInput | CardEnrollmentWhereInput[]
    id?: IntFilter<"CardEnrollment"> | number
    card_number?: StringFilter<"CardEnrollment"> | string
    patient_id?: StringFilter<"CardEnrollment"> | string
    patient_name?: StringNullableFilter<"CardEnrollment"> | string | null
    status?: StringFilter<"CardEnrollment"> | string
    registered_by?: StringNullableFilter<"CardEnrollment"> | string | null
    registered_at?: DateTimeFilter<"CardEnrollment"> | Date | string
    received_by?: StringNullableFilter<"CardEnrollment"> | string | null
    received_at?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    verified_by?: StringNullableFilter<"CardEnrollment"> | string | null
    verified_at?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    transferred_to?: StringNullableFilter<"CardEnrollment"> | string | null
    transferred_at?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    clinic_code?: StringNullableFilter<"CardEnrollment"> | string | null
    created_at?: DateTimeFilter<"CardEnrollment"> | Date | string
    updated_at?: DateTimeFilter<"CardEnrollment"> | Date | string
  }

  export type CardEnrollmentOrderByWithRelationInput = {
    id?: SortOrder
    card_number?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrderInput | SortOrder
    status?: SortOrder
    registered_by?: SortOrderInput | SortOrder
    registered_at?: SortOrder
    received_by?: SortOrderInput | SortOrder
    received_at?: SortOrderInput | SortOrder
    verified_by?: SortOrderInput | SortOrder
    verified_at?: SortOrderInput | SortOrder
    transferred_to?: SortOrderInput | SortOrder
    transferred_at?: SortOrderInput | SortOrder
    clinic_code?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _relevance?: CardEnrollmentOrderByRelevanceInput
  }

  export type CardEnrollmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    card_number?: string
    AND?: CardEnrollmentWhereInput | CardEnrollmentWhereInput[]
    OR?: CardEnrollmentWhereInput[]
    NOT?: CardEnrollmentWhereInput | CardEnrollmentWhereInput[]
    patient_id?: StringFilter<"CardEnrollment"> | string
    patient_name?: StringNullableFilter<"CardEnrollment"> | string | null
    status?: StringFilter<"CardEnrollment"> | string
    registered_by?: StringNullableFilter<"CardEnrollment"> | string | null
    registered_at?: DateTimeFilter<"CardEnrollment"> | Date | string
    received_by?: StringNullableFilter<"CardEnrollment"> | string | null
    received_at?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    verified_by?: StringNullableFilter<"CardEnrollment"> | string | null
    verified_at?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    transferred_to?: StringNullableFilter<"CardEnrollment"> | string | null
    transferred_at?: DateTimeNullableFilter<"CardEnrollment"> | Date | string | null
    clinic_code?: StringNullableFilter<"CardEnrollment"> | string | null
    created_at?: DateTimeFilter<"CardEnrollment"> | Date | string
    updated_at?: DateTimeFilter<"CardEnrollment"> | Date | string
  }, "id" | "card_number">

  export type CardEnrollmentOrderByWithAggregationInput = {
    id?: SortOrder
    card_number?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrderInput | SortOrder
    status?: SortOrder
    registered_by?: SortOrderInput | SortOrder
    registered_at?: SortOrder
    received_by?: SortOrderInput | SortOrder
    received_at?: SortOrderInput | SortOrder
    verified_by?: SortOrderInput | SortOrder
    verified_at?: SortOrderInput | SortOrder
    transferred_to?: SortOrderInput | SortOrder
    transferred_at?: SortOrderInput | SortOrder
    clinic_code?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
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
    card_number?: StringWithAggregatesFilter<"CardEnrollment"> | string
    patient_id?: StringWithAggregatesFilter<"CardEnrollment"> | string
    patient_name?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    status?: StringWithAggregatesFilter<"CardEnrollment"> | string
    registered_by?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    registered_at?: DateTimeWithAggregatesFilter<"CardEnrollment"> | Date | string
    received_by?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    received_at?: DateTimeNullableWithAggregatesFilter<"CardEnrollment"> | Date | string | null
    verified_by?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    verified_at?: DateTimeNullableWithAggregatesFilter<"CardEnrollment"> | Date | string | null
    transferred_to?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    transferred_at?: DateTimeNullableWithAggregatesFilter<"CardEnrollment"> | Date | string | null
    clinic_code?: StringNullableWithAggregatesFilter<"CardEnrollment"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"CardEnrollment"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"CardEnrollment"> | Date | string
  }

  export type CardNumberWhereInput = {
    AND?: CardNumberWhereInput | CardNumberWhereInput[]
    OR?: CardNumberWhereInput[]
    NOT?: CardNumberWhereInput | CardNumberWhereInput[]
    id?: IntFilter<"CardNumber"> | number
    card_number?: StringFilter<"CardNumber"> | string
    barcode?: StringNullableFilter<"CardNumber"> | string | null
    is_used?: IntFilter<"CardNumber"> | number
    created_at?: DateTimeFilter<"CardNumber"> | Date | string
  }

  export type CardNumberOrderByWithRelationInput = {
    id?: SortOrder
    card_number?: SortOrder
    barcode?: SortOrderInput | SortOrder
    is_used?: SortOrder
    created_at?: SortOrder
    _relevance?: CardNumberOrderByRelevanceInput
  }

  export type CardNumberWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    card_number?: string
    AND?: CardNumberWhereInput | CardNumberWhereInput[]
    OR?: CardNumberWhereInput[]
    NOT?: CardNumberWhereInput | CardNumberWhereInput[]
    barcode?: StringNullableFilter<"CardNumber"> | string | null
    is_used?: IntFilter<"CardNumber"> | number
    created_at?: DateTimeFilter<"CardNumber"> | Date | string
  }, "id" | "card_number">

  export type CardNumberOrderByWithAggregationInput = {
    id?: SortOrder
    card_number?: SortOrder
    barcode?: SortOrderInput | SortOrder
    is_used?: SortOrder
    created_at?: SortOrder
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
    card_number?: StringWithAggregatesFilter<"CardNumber"> | string
    barcode?: StringNullableWithAggregatesFilter<"CardNumber"> | string | null
    is_used?: IntWithAggregatesFilter<"CardNumber"> | number
    created_at?: DateTimeWithAggregatesFilter<"CardNumber"> | Date | string
  }

  export type PaymentHistoryWhereInput = {
    AND?: PaymentHistoryWhereInput | PaymentHistoryWhereInput[]
    OR?: PaymentHistoryWhereInput[]
    NOT?: PaymentHistoryWhereInput | PaymentHistoryWhereInput[]
    id?: IntFilter<"PaymentHistory"> | number
    patient_id?: StringFilter<"PaymentHistory"> | string
    queue_id?: IntNullableFilter<"PaymentHistory"> | number | null
    amount?: DecimalFilter<"PaymentHistory"> | Decimal | DecimalJsLike | number | string
    payment_method?: StringNullableFilter<"PaymentHistory"> | string | null
    status?: StringFilter<"PaymentHistory"> | string
    transaction_no?: StringNullableFilter<"PaymentHistory"> | string | null
    or_no?: StringNullableFilter<"PaymentHistory"> | string | null
    clinic_code?: StringNullableFilter<"PaymentHistory"> | string | null
    created_by?: IntNullableFilter<"PaymentHistory"> | number | null
    created_at?: DateTimeFilter<"PaymentHistory"> | Date | string
    updated_at?: DateTimeFilter<"PaymentHistory"> | Date | string
    queue?: XOR<QueueNullableScalarRelationFilter, QueueWhereInput> | null
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type PaymentHistoryOrderByWithRelationInput = {
    id?: SortOrder
    patient_id?: SortOrder
    queue_id?: SortOrderInput | SortOrder
    amount?: SortOrder
    payment_method?: SortOrderInput | SortOrder
    status?: SortOrder
    transaction_no?: SortOrderInput | SortOrder
    or_no?: SortOrderInput | SortOrder
    clinic_code?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    queue?: QueueOrderByWithRelationInput
    creator?: UserOrderByWithRelationInput
    _relevance?: PaymentHistoryOrderByRelevanceInput
  }

  export type PaymentHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: PaymentHistoryWhereInput | PaymentHistoryWhereInput[]
    OR?: PaymentHistoryWhereInput[]
    NOT?: PaymentHistoryWhereInput | PaymentHistoryWhereInput[]
    patient_id?: StringFilter<"PaymentHistory"> | string
    queue_id?: IntNullableFilter<"PaymentHistory"> | number | null
    amount?: DecimalFilter<"PaymentHistory"> | Decimal | DecimalJsLike | number | string
    payment_method?: StringNullableFilter<"PaymentHistory"> | string | null
    status?: StringFilter<"PaymentHistory"> | string
    transaction_no?: StringNullableFilter<"PaymentHistory"> | string | null
    or_no?: StringNullableFilter<"PaymentHistory"> | string | null
    clinic_code?: StringNullableFilter<"PaymentHistory"> | string | null
    created_by?: IntNullableFilter<"PaymentHistory"> | number | null
    created_at?: DateTimeFilter<"PaymentHistory"> | Date | string
    updated_at?: DateTimeFilter<"PaymentHistory"> | Date | string
    queue?: XOR<QueueNullableScalarRelationFilter, QueueWhereInput> | null
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type PaymentHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    patient_id?: SortOrder
    queue_id?: SortOrderInput | SortOrder
    amount?: SortOrder
    payment_method?: SortOrderInput | SortOrder
    status?: SortOrder
    transaction_no?: SortOrderInput | SortOrder
    or_no?: SortOrderInput | SortOrder
    clinic_code?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: PaymentHistoryCountOrderByAggregateInput
    _avg?: PaymentHistoryAvgOrderByAggregateInput
    _max?: PaymentHistoryMaxOrderByAggregateInput
    _min?: PaymentHistoryMinOrderByAggregateInput
    _sum?: PaymentHistorySumOrderByAggregateInput
  }

  export type PaymentHistoryScalarWhereWithAggregatesInput = {
    AND?: PaymentHistoryScalarWhereWithAggregatesInput | PaymentHistoryScalarWhereWithAggregatesInput[]
    OR?: PaymentHistoryScalarWhereWithAggregatesInput[]
    NOT?: PaymentHistoryScalarWhereWithAggregatesInput | PaymentHistoryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"PaymentHistory"> | number
    patient_id?: StringWithAggregatesFilter<"PaymentHistory"> | string
    queue_id?: IntNullableWithAggregatesFilter<"PaymentHistory"> | number | null
    amount?: DecimalWithAggregatesFilter<"PaymentHistory"> | Decimal | DecimalJsLike | number | string
    payment_method?: StringNullableWithAggregatesFilter<"PaymentHistory"> | string | null
    status?: StringWithAggregatesFilter<"PaymentHistory"> | string
    transaction_no?: StringNullableWithAggregatesFilter<"PaymentHistory"> | string | null
    or_no?: StringNullableWithAggregatesFilter<"PaymentHistory"> | string | null
    clinic_code?: StringNullableWithAggregatesFilter<"PaymentHistory"> | string | null
    created_by?: IntNullableWithAggregatesFilter<"PaymentHistory"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"PaymentHistory"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"PaymentHistory"> | Date | string
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: IntFilter<"Transaction"> | number
    transaction_no?: StringFilter<"Transaction"> | string
    patient_id?: StringFilter<"Transaction"> | string
    type?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    description?: StringNullableFilter<"Transaction"> | string | null
    clinic_code?: StringNullableFilter<"Transaction"> | string | null
    created_by?: IntNullableFilter<"Transaction"> | number | null
    created_at?: DateTimeFilter<"Transaction"> | Date | string
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    transaction_no?: SortOrder
    patient_id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrderInput | SortOrder
    clinic_code?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    creator?: UserOrderByWithRelationInput
    _relevance?: TransactionOrderByRelevanceInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    transaction_no?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    patient_id?: StringFilter<"Transaction"> | string
    type?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    description?: StringNullableFilter<"Transaction"> | string | null
    clinic_code?: StringNullableFilter<"Transaction"> | string | null
    created_by?: IntNullableFilter<"Transaction"> | number | null
    created_at?: DateTimeFilter<"Transaction"> | Date | string
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id" | "transaction_no">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    transaction_no?: SortOrder
    patient_id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrderInput | SortOrder
    clinic_code?: SortOrderInput | SortOrder
    created_by?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Transaction"> | number
    transaction_no?: StringWithAggregatesFilter<"Transaction"> | string
    patient_id?: StringWithAggregatesFilter<"Transaction"> | string
    type?: StringWithAggregatesFilter<"Transaction"> | string
    amount?: DecimalWithAggregatesFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    description?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    clinic_code?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    created_by?: IntNullableWithAggregatesFilter<"Transaction"> | number | null
    created_at?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
  }

  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: IntFilter<"Company"> | number
    eros_code?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    address?: StringNullableFilter<"Company"> | string | null
    contact?: StringNullableFilter<"Company"> | string | null
    status?: StringFilter<"Company"> | string
    created_at?: DateTimeFilter<"Company"> | Date | string
    updated_at?: DateTimeFilter<"Company"> | Date | string
    items?: ItemPriceListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    eros_code?: SortOrder
    name?: SortOrder
    address?: SortOrderInput | SortOrder
    contact?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    items?: ItemPriceOrderByRelationAggregateInput
    _relevance?: CompanyOrderByRelevanceInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    eros_code?: string
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    name?: StringFilter<"Company"> | string
    address?: StringNullableFilter<"Company"> | string | null
    contact?: StringNullableFilter<"Company"> | string | null
    status?: StringFilter<"Company"> | string
    created_at?: DateTimeFilter<"Company"> | Date | string
    updated_at?: DateTimeFilter<"Company"> | Date | string
    items?: ItemPriceListRelationFilter
  }, "id" | "eros_code">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    eros_code?: SortOrder
    name?: SortOrder
    address?: SortOrderInput | SortOrder
    contact?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _avg?: CompanyAvgOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
    _sum?: CompanySumOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Company"> | number
    eros_code?: StringWithAggregatesFilter<"Company"> | string
    name?: StringWithAggregatesFilter<"Company"> | string
    address?: StringNullableWithAggregatesFilter<"Company"> | string | null
    contact?: StringNullableWithAggregatesFilter<"Company"> | string | null
    status?: StringWithAggregatesFilter<"Company"> | string
    created_at?: DateTimeWithAggregatesFilter<"Company"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type ItemMasterWhereInput = {
    AND?: ItemMasterWhereInput | ItemMasterWhereInput[]
    OR?: ItemMasterWhereInput[]
    NOT?: ItemMasterWhereInput | ItemMasterWhereInput[]
    id?: IntFilter<"ItemMaster"> | number
    item_code?: StringFilter<"ItemMaster"> | string
    item_name?: StringFilter<"ItemMaster"> | string
    category?: StringNullableFilter<"ItemMaster"> | string | null
    department?: StringNullableFilter<"ItemMaster"> | string | null
    status?: StringFilter<"ItemMaster"> | string
    created_at?: DateTimeFilter<"ItemMaster"> | Date | string
    updated_at?: DateTimeFilter<"ItemMaster"> | Date | string
    prices?: ItemPriceListRelationFilter
  }

  export type ItemMasterOrderByWithRelationInput = {
    id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrder
    category?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    prices?: ItemPriceOrderByRelationAggregateInput
    _relevance?: ItemMasterOrderByRelevanceInput
  }

  export type ItemMasterWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    item_code?: string
    AND?: ItemMasterWhereInput | ItemMasterWhereInput[]
    OR?: ItemMasterWhereInput[]
    NOT?: ItemMasterWhereInput | ItemMasterWhereInput[]
    item_name?: StringFilter<"ItemMaster"> | string
    category?: StringNullableFilter<"ItemMaster"> | string | null
    department?: StringNullableFilter<"ItemMaster"> | string | null
    status?: StringFilter<"ItemMaster"> | string
    created_at?: DateTimeFilter<"ItemMaster"> | Date | string
    updated_at?: DateTimeFilter<"ItemMaster"> | Date | string
    prices?: ItemPriceListRelationFilter
  }, "id" | "item_code">

  export type ItemMasterOrderByWithAggregationInput = {
    id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrder
    category?: SortOrderInput | SortOrder
    department?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ItemMasterCountOrderByAggregateInput
    _avg?: ItemMasterAvgOrderByAggregateInput
    _max?: ItemMasterMaxOrderByAggregateInput
    _min?: ItemMasterMinOrderByAggregateInput
    _sum?: ItemMasterSumOrderByAggregateInput
  }

  export type ItemMasterScalarWhereWithAggregatesInput = {
    AND?: ItemMasterScalarWhereWithAggregatesInput | ItemMasterScalarWhereWithAggregatesInput[]
    OR?: ItemMasterScalarWhereWithAggregatesInput[]
    NOT?: ItemMasterScalarWhereWithAggregatesInput | ItemMasterScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ItemMaster"> | number
    item_code?: StringWithAggregatesFilter<"ItemMaster"> | string
    item_name?: StringWithAggregatesFilter<"ItemMaster"> | string
    category?: StringNullableWithAggregatesFilter<"ItemMaster"> | string | null
    department?: StringNullableWithAggregatesFilter<"ItemMaster"> | string | null
    status?: StringWithAggregatesFilter<"ItemMaster"> | string
    created_at?: DateTimeWithAggregatesFilter<"ItemMaster"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ItemMaster"> | Date | string
  }

  export type ItemPriceWhereInput = {
    AND?: ItemPriceWhereInput | ItemPriceWhereInput[]
    OR?: ItemPriceWhereInput[]
    NOT?: ItemPriceWhereInput | ItemPriceWhereInput[]
    id?: IntFilter<"ItemPrice"> | number
    item_code?: StringFilter<"ItemPrice"> | string
    company_code?: StringFilter<"ItemPrice"> | string
    price?: DecimalFilter<"ItemPrice"> | Decimal | DecimalJsLike | number | string
    price_group?: StringNullableFilter<"ItemPrice"> | string | null
    status?: StringFilter<"ItemPrice"> | string
    created_at?: DateTimeFilter<"ItemPrice"> | Date | string
    updated_at?: DateTimeFilter<"ItemPrice"> | Date | string
    item?: XOR<ItemMasterScalarRelationFilter, ItemMasterWhereInput>
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
  }

  export type ItemPriceOrderByWithRelationInput = {
    id?: SortOrder
    item_code?: SortOrder
    company_code?: SortOrder
    price?: SortOrder
    price_group?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    item?: ItemMasterOrderByWithRelationInput
    company?: CompanyOrderByWithRelationInput
    _relevance?: ItemPriceOrderByRelevanceInput
  }

  export type ItemPriceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    item_code_company_code?: ItemPriceItem_codeCompany_codeCompoundUniqueInput
    AND?: ItemPriceWhereInput | ItemPriceWhereInput[]
    OR?: ItemPriceWhereInput[]
    NOT?: ItemPriceWhereInput | ItemPriceWhereInput[]
    item_code?: StringFilter<"ItemPrice"> | string
    company_code?: StringFilter<"ItemPrice"> | string
    price?: DecimalFilter<"ItemPrice"> | Decimal | DecimalJsLike | number | string
    price_group?: StringNullableFilter<"ItemPrice"> | string | null
    status?: StringFilter<"ItemPrice"> | string
    created_at?: DateTimeFilter<"ItemPrice"> | Date | string
    updated_at?: DateTimeFilter<"ItemPrice"> | Date | string
    item?: XOR<ItemMasterScalarRelationFilter, ItemMasterWhereInput>
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
  }, "id" | "item_code_company_code">

  export type ItemPriceOrderByWithAggregationInput = {
    id?: SortOrder
    item_code?: SortOrder
    company_code?: SortOrder
    price?: SortOrder
    price_group?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: ItemPriceCountOrderByAggregateInput
    _avg?: ItemPriceAvgOrderByAggregateInput
    _max?: ItemPriceMaxOrderByAggregateInput
    _min?: ItemPriceMinOrderByAggregateInput
    _sum?: ItemPriceSumOrderByAggregateInput
  }

  export type ItemPriceScalarWhereWithAggregatesInput = {
    AND?: ItemPriceScalarWhereWithAggregatesInput | ItemPriceScalarWhereWithAggregatesInput[]
    OR?: ItemPriceScalarWhereWithAggregatesInput[]
    NOT?: ItemPriceScalarWhereWithAggregatesInput | ItemPriceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ItemPrice"> | number
    item_code?: StringWithAggregatesFilter<"ItemPrice"> | string
    company_code?: StringWithAggregatesFilter<"ItemPrice"> | string
    price?: DecimalWithAggregatesFilter<"ItemPrice"> | Decimal | DecimalJsLike | number | string
    price_group?: StringNullableWithAggregatesFilter<"ItemPrice"> | string | null
    status?: StringWithAggregatesFilter<"ItemPrice"> | string
    created_at?: DateTimeWithAggregatesFilter<"ItemPrice"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"ItemPrice"> | Date | string
  }

  export type PhysicianWhereInput = {
    AND?: PhysicianWhereInput | PhysicianWhereInput[]
    OR?: PhysicianWhereInput[]
    NOT?: PhysicianWhereInput | PhysicianWhereInput[]
    id?: IntFilter<"Physician"> | number
    code?: StringFilter<"Physician"> | string
    name?: StringFilter<"Physician"> | string
    license_no?: StringNullableFilter<"Physician"> | string | null
    specialty?: StringNullableFilter<"Physician"> | string | null
    status?: StringFilter<"Physician"> | string
    created_at?: DateTimeFilter<"Physician"> | Date | string
    updated_at?: DateTimeFilter<"Physician"> | Date | string
  }

  export type PhysicianOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    license_no?: SortOrderInput | SortOrder
    specialty?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _relevance?: PhysicianOrderByRelevanceInput
  }

  export type PhysicianWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    code?: string
    AND?: PhysicianWhereInput | PhysicianWhereInput[]
    OR?: PhysicianWhereInput[]
    NOT?: PhysicianWhereInput | PhysicianWhereInput[]
    name?: StringFilter<"Physician"> | string
    license_no?: StringNullableFilter<"Physician"> | string | null
    specialty?: StringNullableFilter<"Physician"> | string | null
    status?: StringFilter<"Physician"> | string
    created_at?: DateTimeFilter<"Physician"> | Date | string
    updated_at?: DateTimeFilter<"Physician"> | Date | string
  }, "id" | "code">

  export type PhysicianOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    license_no?: SortOrderInput | SortOrder
    specialty?: SortOrderInput | SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: PhysicianCountOrderByAggregateInput
    _avg?: PhysicianAvgOrderByAggregateInput
    _max?: PhysicianMaxOrderByAggregateInput
    _min?: PhysicianMinOrderByAggregateInput
    _sum?: PhysicianSumOrderByAggregateInput
  }

  export type PhysicianScalarWhereWithAggregatesInput = {
    AND?: PhysicianScalarWhereWithAggregatesInput | PhysicianScalarWhereWithAggregatesInput[]
    OR?: PhysicianScalarWhereWithAggregatesInput[]
    NOT?: PhysicianScalarWhereWithAggregatesInput | PhysicianScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Physician"> | number
    code?: StringWithAggregatesFilter<"Physician"> | string
    name?: StringWithAggregatesFilter<"Physician"> | string
    license_no?: StringNullableWithAggregatesFilter<"Physician"> | string | null
    specialty?: StringNullableWithAggregatesFilter<"Physician"> | string | null
    status?: StringWithAggregatesFilter<"Physician"> | string
    created_at?: DateTimeWithAggregatesFilter<"Physician"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Physician"> | Date | string
  }

  export type HL7MessageWhereInput = {
    AND?: HL7MessageWhereInput | HL7MessageWhereInput[]
    OR?: HL7MessageWhereInput[]
    NOT?: HL7MessageWhereInput | HL7MessageWhereInput[]
    id?: IntFilter<"HL7Message"> | number
    facility_code?: StringFilter<"HL7Message"> | string
    message_type?: StringFilter<"HL7Message"> | string
    accession_no?: StringNullableFilter<"HL7Message"> | string | null
    patient_id?: StringNullableFilter<"HL7Message"> | string | null
    status?: StringFilter<"HL7Message"> | string
    raw_message?: StringNullableFilter<"HL7Message"> | string | null
    error_message?: StringNullableFilter<"HL7Message"> | string | null
    created_at?: DateTimeFilter<"HL7Message"> | Date | string
    updated_at?: DateTimeFilter<"HL7Message"> | Date | string
  }

  export type HL7MessageOrderByWithRelationInput = {
    id?: SortOrder
    facility_code?: SortOrder
    message_type?: SortOrder
    accession_no?: SortOrderInput | SortOrder
    patient_id?: SortOrderInput | SortOrder
    status?: SortOrder
    raw_message?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _relevance?: HL7MessageOrderByRelevanceInput
  }

  export type HL7MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: HL7MessageWhereInput | HL7MessageWhereInput[]
    OR?: HL7MessageWhereInput[]
    NOT?: HL7MessageWhereInput | HL7MessageWhereInput[]
    facility_code?: StringFilter<"HL7Message"> | string
    message_type?: StringFilter<"HL7Message"> | string
    accession_no?: StringNullableFilter<"HL7Message"> | string | null
    patient_id?: StringNullableFilter<"HL7Message"> | string | null
    status?: StringFilter<"HL7Message"> | string
    raw_message?: StringNullableFilter<"HL7Message"> | string | null
    error_message?: StringNullableFilter<"HL7Message"> | string | null
    created_at?: DateTimeFilter<"HL7Message"> | Date | string
    updated_at?: DateTimeFilter<"HL7Message"> | Date | string
  }, "id">

  export type HL7MessageOrderByWithAggregationInput = {
    id?: SortOrder
    facility_code?: SortOrder
    message_type?: SortOrder
    accession_no?: SortOrderInput | SortOrder
    patient_id?: SortOrderInput | SortOrder
    status?: SortOrder
    raw_message?: SortOrderInput | SortOrder
    error_message?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: HL7MessageCountOrderByAggregateInput
    _avg?: HL7MessageAvgOrderByAggregateInput
    _max?: HL7MessageMaxOrderByAggregateInput
    _min?: HL7MessageMinOrderByAggregateInput
    _sum?: HL7MessageSumOrderByAggregateInput
  }

  export type HL7MessageScalarWhereWithAggregatesInput = {
    AND?: HL7MessageScalarWhereWithAggregatesInput | HL7MessageScalarWhereWithAggregatesInput[]
    OR?: HL7MessageScalarWhereWithAggregatesInput[]
    NOT?: HL7MessageScalarWhereWithAggregatesInput | HL7MessageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"HL7Message"> | number
    facility_code?: StringWithAggregatesFilter<"HL7Message"> | string
    message_type?: StringWithAggregatesFilter<"HL7Message"> | string
    accession_no?: StringNullableWithAggregatesFilter<"HL7Message"> | string | null
    patient_id?: StringNullableWithAggregatesFilter<"HL7Message"> | string | null
    status?: StringWithAggregatesFilter<"HL7Message"> | string
    raw_message?: StringNullableWithAggregatesFilter<"HL7Message"> | string | null
    error_message?: StringNullableWithAggregatesFilter<"HL7Message"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"HL7Message"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"HL7Message"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: IntFilter<"Role"> | number
    ldap_role?: StringFilter<"Role"> | string
    module?: StringFilter<"Role"> | string
    tab?: StringFilter<"Role"> | string
    description?: StringNullableFilter<"Role"> | string | null
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    ldap_role?: SortOrder
    module?: SortOrder
    tab?: SortOrder
    description?: SortOrderInput | SortOrder
    _relevance?: RoleOrderByRelevanceInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    ldap_role?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    module?: StringFilter<"Role"> | string
    tab?: StringFilter<"Role"> | string
    description?: StringNullableFilter<"Role"> | string | null
  }, "id" | "ldap_role">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    ldap_role?: SortOrder
    module?: SortOrder
    tab?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: RoleCountOrderByAggregateInput
    _avg?: RoleAvgOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
    _sum?: RoleSumOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Role"> | number
    ldap_role?: StringWithAggregatesFilter<"Role"> | string
    module?: StringWithAggregatesFilter<"Role"> | string
    tab?: StringWithAggregatesFilter<"Role"> | string
    description?: StringNullableWithAggregatesFilter<"Role"> | string | null
  }

  export type SettingWhereInput = {
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    id?: IntFilter<"Setting"> | number
    key?: StringFilter<"Setting"> | string
    value?: StringFilter<"Setting"> | string
  }

  export type SettingOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    _relevance?: SettingOrderByRelevanceInput
  }

  export type SettingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    key?: string
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    value?: StringFilter<"Setting"> | string
  }, "id" | "key">

  export type SettingOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    _count?: SettingCountOrderByAggregateInput
    _avg?: SettingAvgOrderByAggregateInput
    _max?: SettingMaxOrderByAggregateInput
    _min?: SettingMinOrderByAggregateInput
    _sum?: SettingSumOrderByAggregateInput
  }

  export type SettingScalarWhereWithAggregatesInput = {
    AND?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    OR?: SettingScalarWhereWithAggregatesInput[]
    NOT?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Setting"> | number
    key?: StringWithAggregatesFilter<"Setting"> | string
    value?: StringWithAggregatesFilter<"Setting"> | string
  }

  export type UserCreateInput = {
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queues?: QueueCreateNestedManyWithoutCreatorInput
    payments?: PaymentHistoryCreateNestedManyWithoutCreatorInput
    transactions?: TransactionCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queues?: QueueUncheckedCreateNestedManyWithoutCreatorInput
    payments?: PaymentHistoryUncheckedCreateNestedManyWithoutCreatorInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queues?: QueueUpdateManyWithoutCreatorNestedInput
    payments?: PaymentHistoryUpdateManyWithoutCreatorNestedInput
    transactions?: TransactionUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queues?: QueueUncheckedUpdateManyWithoutCreatorNestedInput
    payments?: PaymentHistoryUncheckedUpdateManyWithoutCreatorNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueueCreateInput = {
    patient_id: string
    patient_name: string
    company_code?: string | null
    company_name?: string | null
    queue_number: number
    status?: string
    priority?: number
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    creator?: UserCreateNestedOneWithoutQueuesInput
    payments?: PaymentHistoryCreateNestedManyWithoutQueueInput
  }

  export type QueueUncheckedCreateInput = {
    id?: number
    patient_id: string
    patient_name: string
    company_code?: string | null
    company_name?: string | null
    queue_number: number
    status?: string
    priority?: number
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
    payments?: PaymentHistoryUncheckedCreateNestedManyWithoutQueueInput
  }

  export type QueueUpdateInput = {
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneWithoutQueuesNestedInput
    payments?: PaymentHistoryUpdateManyWithoutQueueNestedInput
  }

  export type QueueUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentHistoryUncheckedUpdateManyWithoutQueueNestedInput
  }

  export type QueueCreateManyInput = {
    id?: number
    patient_id: string
    patient_name: string
    company_code?: string | null
    company_name?: string | null
    queue_number: number
    status?: string
    priority?: number
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type QueueUpdateManyMutationInput = {
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueueUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardEnrollmentCreateInput = {
    card_number: string
    patient_id: string
    patient_name?: string | null
    status?: string
    registered_by?: string | null
    registered_at?: Date | string
    received_by?: string | null
    received_at?: Date | string | null
    verified_by?: string | null
    verified_at?: Date | string | null
    transferred_to?: string | null
    transferred_at?: Date | string | null
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CardEnrollmentUncheckedCreateInput = {
    id?: number
    card_number: string
    patient_id: string
    patient_name?: string | null
    status?: string
    registered_by?: string | null
    registered_at?: Date | string
    received_by?: string | null
    received_at?: Date | string | null
    verified_by?: string | null
    verified_at?: Date | string | null
    transferred_to?: string | null
    transferred_at?: Date | string | null
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CardEnrollmentUpdateInput = {
    card_number?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    registered_by?: NullableStringFieldUpdateOperationsInput | string | null
    registered_at?: DateTimeFieldUpdateOperationsInput | Date | string
    received_by?: NullableStringFieldUpdateOperationsInput | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verified_by?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferred_to?: NullableStringFieldUpdateOperationsInput | string | null
    transferred_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardEnrollmentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    card_number?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    registered_by?: NullableStringFieldUpdateOperationsInput | string | null
    registered_at?: DateTimeFieldUpdateOperationsInput | Date | string
    received_by?: NullableStringFieldUpdateOperationsInput | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verified_by?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferred_to?: NullableStringFieldUpdateOperationsInput | string | null
    transferred_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardEnrollmentCreateManyInput = {
    id?: number
    card_number: string
    patient_id: string
    patient_name?: string | null
    status?: string
    registered_by?: string | null
    registered_at?: Date | string
    received_by?: string | null
    received_at?: Date | string | null
    verified_by?: string | null
    verified_at?: Date | string | null
    transferred_to?: string | null
    transferred_at?: Date | string | null
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CardEnrollmentUpdateManyMutationInput = {
    card_number?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    registered_by?: NullableStringFieldUpdateOperationsInput | string | null
    registered_at?: DateTimeFieldUpdateOperationsInput | Date | string
    received_by?: NullableStringFieldUpdateOperationsInput | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verified_by?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferred_to?: NullableStringFieldUpdateOperationsInput | string | null
    transferred_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardEnrollmentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    card_number?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    registered_by?: NullableStringFieldUpdateOperationsInput | string | null
    registered_at?: DateTimeFieldUpdateOperationsInput | Date | string
    received_by?: NullableStringFieldUpdateOperationsInput | string | null
    received_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    verified_by?: NullableStringFieldUpdateOperationsInput | string | null
    verified_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    transferred_to?: NullableStringFieldUpdateOperationsInput | string | null
    transferred_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardNumberCreateInput = {
    card_number: string
    barcode?: string | null
    is_used?: number
    created_at?: Date | string
  }

  export type CardNumberUncheckedCreateInput = {
    id?: number
    card_number: string
    barcode?: string | null
    is_used?: number
    created_at?: Date | string
  }

  export type CardNumberUpdateInput = {
    card_number?: StringFieldUpdateOperationsInput | string
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    is_used?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardNumberUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    card_number?: StringFieldUpdateOperationsInput | string
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    is_used?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardNumberCreateManyInput = {
    id?: number
    card_number: string
    barcode?: string | null
    is_used?: number
    created_at?: Date | string
  }

  export type CardNumberUpdateManyMutationInput = {
    card_number?: StringFieldUpdateOperationsInput | string
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    is_used?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CardNumberUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    card_number?: StringFieldUpdateOperationsInput | string
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    is_used?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentHistoryCreateInput = {
    patient_id: string
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    queue?: QueueCreateNestedOneWithoutPaymentsInput
    creator?: UserCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentHistoryUncheckedCreateInput = {
    id?: number
    patient_id: string
    queue_id?: number | null
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentHistoryUpdateInput = {
    patient_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueUpdateOneWithoutPaymentsNestedInput
    creator?: UserUpdateOneWithoutPaymentsNestedInput
  }

  export type PaymentHistoryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    queue_id?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentHistoryCreateManyInput = {
    id?: number
    patient_id: string
    queue_id?: number | null
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentHistoryUpdateManyMutationInput = {
    patient_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentHistoryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    queue_id?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateInput = {
    transaction_no: string
    patient_id: string
    type: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    clinic_code?: string | null
    created_at?: Date | string
    creator?: UserCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: number
    transaction_no: string
    patient_id: string
    type: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
  }

  export type TransactionUpdateInput = {
    transaction_no?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    transaction_no?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionCreateManyInput = {
    id?: number
    transaction_no: string
    patient_id: string
    type: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
  }

  export type TransactionUpdateManyMutationInput = {
    transaction_no?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    transaction_no?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyCreateInput = {
    eros_code: string
    name: string
    address?: string | null
    contact?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    items?: ItemPriceCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id?: number
    eros_code: string
    name: string
    address?: string | null
    contact?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    items?: ItemPriceUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    eros_code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ItemPriceUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    eros_code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: ItemPriceUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id?: number
    eros_code: string
    name: string
    address?: string | null
    contact?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    eros_code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    eros_code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemMasterCreateInput = {
    item_code: string
    item_name: string
    category?: string | null
    department?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    prices?: ItemPriceCreateNestedManyWithoutItemInput
  }

  export type ItemMasterUncheckedCreateInput = {
    id?: number
    item_code: string
    item_name: string
    category?: string | null
    department?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    prices?: ItemPriceUncheckedCreateNestedManyWithoutItemInput
  }

  export type ItemMasterUpdateInput = {
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: ItemPriceUpdateManyWithoutItemNestedInput
  }

  export type ItemMasterUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    prices?: ItemPriceUncheckedUpdateManyWithoutItemNestedInput
  }

  export type ItemMasterCreateManyInput = {
    id?: number
    item_code: string
    item_name: string
    category?: string | null
    department?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemMasterUpdateManyMutationInput = {
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemMasterUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPriceCreateInput = {
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    item: ItemMasterCreateNestedOneWithoutPricesInput
    company: CompanyCreateNestedOneWithoutItemsInput
  }

  export type ItemPriceUncheckedCreateInput = {
    id?: number
    item_code: string
    company_code: string
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemPriceUpdateInput = {
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: ItemMasterUpdateOneRequiredWithoutPricesNestedInput
    company?: CompanyUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ItemPriceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_code?: StringFieldUpdateOperationsInput | string
    company_code?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPriceCreateManyInput = {
    id?: number
    item_code: string
    company_code: string
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemPriceUpdateManyMutationInput = {
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPriceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_code?: StringFieldUpdateOperationsInput | string
    company_code?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhysicianCreateInput = {
    code: string
    name: string
    license_no?: string | null
    specialty?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PhysicianUncheckedCreateInput = {
    id?: number
    code: string
    name: string
    license_no?: string | null
    specialty?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PhysicianUpdateInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    license_no?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhysicianUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    license_no?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhysicianCreateManyInput = {
    id?: number
    code: string
    name: string
    license_no?: string | null
    specialty?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PhysicianUpdateManyMutationInput = {
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    license_no?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhysicianUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    license_no?: NullableStringFieldUpdateOperationsInput | string | null
    specialty?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HL7MessageCreateInput = {
    facility_code: string
    message_type: string
    accession_no?: string | null
    patient_id?: string | null
    status?: string
    raw_message?: string | null
    error_message?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type HL7MessageUncheckedCreateInput = {
    id?: number
    facility_code: string
    message_type: string
    accession_no?: string | null
    patient_id?: string | null
    status?: string
    raw_message?: string | null
    error_message?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type HL7MessageUpdateInput = {
    facility_code?: StringFieldUpdateOperationsInput | string
    message_type?: StringFieldUpdateOperationsInput | string
    accession_no?: NullableStringFieldUpdateOperationsInput | string | null
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    raw_message?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HL7MessageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_code?: StringFieldUpdateOperationsInput | string
    message_type?: StringFieldUpdateOperationsInput | string
    accession_no?: NullableStringFieldUpdateOperationsInput | string | null
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    raw_message?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HL7MessageCreateManyInput = {
    id?: number
    facility_code: string
    message_type: string
    accession_no?: string | null
    patient_id?: string | null
    status?: string
    raw_message?: string | null
    error_message?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type HL7MessageUpdateManyMutationInput = {
    facility_code?: StringFieldUpdateOperationsInput | string
    message_type?: StringFieldUpdateOperationsInput | string
    accession_no?: NullableStringFieldUpdateOperationsInput | string | null
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    raw_message?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HL7MessageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    facility_code?: StringFieldUpdateOperationsInput | string
    message_type?: StringFieldUpdateOperationsInput | string
    accession_no?: NullableStringFieldUpdateOperationsInput | string | null
    patient_id?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    raw_message?: NullableStringFieldUpdateOperationsInput | string | null
    error_message?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    ldap_role: string
    module: string
    tab: string
    description?: string | null
  }

  export type RoleUncheckedCreateInput = {
    id?: number
    ldap_role: string
    module: string
    tab: string
    description?: string | null
  }

  export type RoleUpdateInput = {
    ldap_role?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    tab?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    ldap_role?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    tab?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoleCreateManyInput = {
    id?: number
    ldap_role: string
    module: string
    tab: string
    description?: string | null
  }

  export type RoleUpdateManyMutationInput = {
    ldap_role?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    tab?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    ldap_role?: StringFieldUpdateOperationsInput | string
    module?: StringFieldUpdateOperationsInput | string
    tab?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SettingCreateInput = {
    key: string
    value: string
  }

  export type SettingUncheckedCreateInput = {
    id?: number
    key: string
    value: string
  }

  export type SettingUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingCreateManyInput = {
    id?: number
    key: string
    value: string
  }

  export type SettingUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type SettingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type QueueListRelationFilter = {
    every?: QueueWhereInput
    some?: QueueWhereInput
    none?: QueueWhereInput
  }

  export type PaymentHistoryListRelationFilter = {
    every?: PaymentHistoryWhereInput
    some?: PaymentHistoryWhereInput
    none?: PaymentHistoryWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type QueueOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PaymentHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    department?: SortOrder
    role?: SortOrder
    activated?: SortOrder
    ldap_import?: SortOrder
    deleted_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    activated?: SortOrder
    ldap_import?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    department?: SortOrder
    role?: SortOrder
    activated?: SortOrder
    ldap_import?: SortOrder
    deleted_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    department?: SortOrder
    role?: SortOrder
    activated?: SortOrder
    ldap_import?: SortOrder
    deleted_at?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    activated?: SortOrder
    ldap_import?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type QueueOrderByRelevanceInput = {
    fields: QueueOrderByRelevanceFieldEnum | QueueOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type QueueCountOrderByAggregateInput = {
    id?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrder
    company_code?: SortOrder
    company_name?: SortOrder
    queue_number?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type QueueAvgOrderByAggregateInput = {
    id?: SortOrder
    queue_number?: SortOrder
    priority?: SortOrder
    created_by?: SortOrder
  }

  export type QueueMaxOrderByAggregateInput = {
    id?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrder
    company_code?: SortOrder
    company_name?: SortOrder
    queue_number?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type QueueMinOrderByAggregateInput = {
    id?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrder
    company_code?: SortOrder
    company_name?: SortOrder
    queue_number?: SortOrder
    status?: SortOrder
    priority?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type QueueSumOrderByAggregateInput = {
    id?: SortOrder
    queue_number?: SortOrder
    priority?: SortOrder
    created_by?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
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

  export type CardEnrollmentOrderByRelevanceInput = {
    fields: CardEnrollmentOrderByRelevanceFieldEnum | CardEnrollmentOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CardEnrollmentCountOrderByAggregateInput = {
    id?: SortOrder
    card_number?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrder
    status?: SortOrder
    registered_by?: SortOrder
    registered_at?: SortOrder
    received_by?: SortOrder
    received_at?: SortOrder
    verified_by?: SortOrder
    verified_at?: SortOrder
    transferred_to?: SortOrder
    transferred_at?: SortOrder
    clinic_code?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CardEnrollmentAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CardEnrollmentMaxOrderByAggregateInput = {
    id?: SortOrder
    card_number?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrder
    status?: SortOrder
    registered_by?: SortOrder
    registered_at?: SortOrder
    received_by?: SortOrder
    received_at?: SortOrder
    verified_by?: SortOrder
    verified_at?: SortOrder
    transferred_to?: SortOrder
    transferred_at?: SortOrder
    clinic_code?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CardEnrollmentMinOrderByAggregateInput = {
    id?: SortOrder
    card_number?: SortOrder
    patient_id?: SortOrder
    patient_name?: SortOrder
    status?: SortOrder
    registered_by?: SortOrder
    registered_at?: SortOrder
    received_by?: SortOrder
    received_at?: SortOrder
    verified_by?: SortOrder
    verified_at?: SortOrder
    transferred_to?: SortOrder
    transferred_at?: SortOrder
    clinic_code?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CardEnrollmentSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CardNumberOrderByRelevanceInput = {
    fields: CardNumberOrderByRelevanceFieldEnum | CardNumberOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CardNumberCountOrderByAggregateInput = {
    id?: SortOrder
    card_number?: SortOrder
    barcode?: SortOrder
    is_used?: SortOrder
    created_at?: SortOrder
  }

  export type CardNumberAvgOrderByAggregateInput = {
    id?: SortOrder
    is_used?: SortOrder
  }

  export type CardNumberMaxOrderByAggregateInput = {
    id?: SortOrder
    card_number?: SortOrder
    barcode?: SortOrder
    is_used?: SortOrder
    created_at?: SortOrder
  }

  export type CardNumberMinOrderByAggregateInput = {
    id?: SortOrder
    card_number?: SortOrder
    barcode?: SortOrder
    is_used?: SortOrder
    created_at?: SortOrder
  }

  export type CardNumberSumOrderByAggregateInput = {
    id?: SortOrder
    is_used?: SortOrder
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type QueueNullableScalarRelationFilter = {
    is?: QueueWhereInput | null
    isNot?: QueueWhereInput | null
  }

  export type PaymentHistoryOrderByRelevanceInput = {
    fields: PaymentHistoryOrderByRelevanceFieldEnum | PaymentHistoryOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PaymentHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    patient_id?: SortOrder
    queue_id?: SortOrder
    amount?: SortOrder
    payment_method?: SortOrder
    status?: SortOrder
    transaction_no?: SortOrder
    or_no?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentHistoryAvgOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    amount?: SortOrder
    created_by?: SortOrder
  }

  export type PaymentHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    patient_id?: SortOrder
    queue_id?: SortOrder
    amount?: SortOrder
    payment_method?: SortOrder
    status?: SortOrder
    transaction_no?: SortOrder
    or_no?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    patient_id?: SortOrder
    queue_id?: SortOrder
    amount?: SortOrder
    payment_method?: SortOrder
    status?: SortOrder
    transaction_no?: SortOrder
    or_no?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PaymentHistorySumOrderByAggregateInput = {
    id?: SortOrder
    queue_id?: SortOrder
    amount?: SortOrder
    created_by?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type TransactionOrderByRelevanceInput = {
    fields: TransactionOrderByRelevanceFieldEnum | TransactionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    transaction_no?: SortOrder
    patient_id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    created_by?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    transaction_no?: SortOrder
    patient_id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    transaction_no?: SortOrder
    patient_id?: SortOrder
    type?: SortOrder
    amount?: SortOrder
    description?: SortOrder
    clinic_code?: SortOrder
    created_by?: SortOrder
    created_at?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    created_by?: SortOrder
  }

  export type ItemPriceListRelationFilter = {
    every?: ItemPriceWhereInput
    some?: ItemPriceWhereInput
    none?: ItemPriceWhereInput
  }

  export type ItemPriceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyOrderByRelevanceInput = {
    fields: CompanyOrderByRelevanceFieldEnum | CompanyOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    eros_code?: SortOrder
    name?: SortOrder
    address?: SortOrder
    contact?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CompanyAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    eros_code?: SortOrder
    name?: SortOrder
    address?: SortOrder
    contact?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    eros_code?: SortOrder
    name?: SortOrder
    address?: SortOrder
    contact?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type CompanySumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ItemMasterOrderByRelevanceInput = {
    fields: ItemMasterOrderByRelevanceFieldEnum | ItemMasterOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ItemMasterCountOrderByAggregateInput = {
    id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrder
    category?: SortOrder
    department?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ItemMasterAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ItemMasterMaxOrderByAggregateInput = {
    id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrder
    category?: SortOrder
    department?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ItemMasterMinOrderByAggregateInput = {
    id?: SortOrder
    item_code?: SortOrder
    item_name?: SortOrder
    category?: SortOrder
    department?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ItemMasterSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ItemMasterScalarRelationFilter = {
    is?: ItemMasterWhereInput
    isNot?: ItemMasterWhereInput
  }

  export type CompanyScalarRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type ItemPriceOrderByRelevanceInput = {
    fields: ItemPriceOrderByRelevanceFieldEnum | ItemPriceOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ItemPriceItem_codeCompany_codeCompoundUniqueInput = {
    item_code: string
    company_code: string
  }

  export type ItemPriceCountOrderByAggregateInput = {
    id?: SortOrder
    item_code?: SortOrder
    company_code?: SortOrder
    price?: SortOrder
    price_group?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ItemPriceAvgOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
  }

  export type ItemPriceMaxOrderByAggregateInput = {
    id?: SortOrder
    item_code?: SortOrder
    company_code?: SortOrder
    price?: SortOrder
    price_group?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ItemPriceMinOrderByAggregateInput = {
    id?: SortOrder
    item_code?: SortOrder
    company_code?: SortOrder
    price?: SortOrder
    price_group?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type ItemPriceSumOrderByAggregateInput = {
    id?: SortOrder
    price?: SortOrder
  }

  export type PhysicianOrderByRelevanceInput = {
    fields: PhysicianOrderByRelevanceFieldEnum | PhysicianOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type PhysicianCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    license_no?: SortOrder
    specialty?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PhysicianAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PhysicianMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    license_no?: SortOrder
    specialty?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PhysicianMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    name?: SortOrder
    license_no?: SortOrder
    specialty?: SortOrder
    status?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type PhysicianSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type HL7MessageOrderByRelevanceInput = {
    fields: HL7MessageOrderByRelevanceFieldEnum | HL7MessageOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type HL7MessageCountOrderByAggregateInput = {
    id?: SortOrder
    facility_code?: SortOrder
    message_type?: SortOrder
    accession_no?: SortOrder
    patient_id?: SortOrder
    status?: SortOrder
    raw_message?: SortOrder
    error_message?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type HL7MessageAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type HL7MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    facility_code?: SortOrder
    message_type?: SortOrder
    accession_no?: SortOrder
    patient_id?: SortOrder
    status?: SortOrder
    raw_message?: SortOrder
    error_message?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type HL7MessageMinOrderByAggregateInput = {
    id?: SortOrder
    facility_code?: SortOrder
    message_type?: SortOrder
    accession_no?: SortOrder
    patient_id?: SortOrder
    status?: SortOrder
    raw_message?: SortOrder
    error_message?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type HL7MessageSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RoleOrderByRelevanceInput = {
    fields: RoleOrderByRelevanceFieldEnum | RoleOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    ldap_role?: SortOrder
    module?: SortOrder
    tab?: SortOrder
    description?: SortOrder
  }

  export type RoleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    ldap_role?: SortOrder
    module?: SortOrder
    tab?: SortOrder
    description?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    ldap_role?: SortOrder
    module?: SortOrder
    tab?: SortOrder
    description?: SortOrder
  }

  export type RoleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SettingOrderByRelevanceInput = {
    fields: SettingOrderByRelevanceFieldEnum | SettingOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SettingCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SettingMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
  }

  export type SettingSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type QueueCreateNestedManyWithoutCreatorInput = {
    create?: XOR<QueueCreateWithoutCreatorInput, QueueUncheckedCreateWithoutCreatorInput> | QueueCreateWithoutCreatorInput[] | QueueUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: QueueCreateOrConnectWithoutCreatorInput | QueueCreateOrConnectWithoutCreatorInput[]
    createMany?: QueueCreateManyCreatorInputEnvelope
    connect?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
  }

  export type PaymentHistoryCreateNestedManyWithoutCreatorInput = {
    create?: XOR<PaymentHistoryCreateWithoutCreatorInput, PaymentHistoryUncheckedCreateWithoutCreatorInput> | PaymentHistoryCreateWithoutCreatorInput[] | PaymentHistoryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: PaymentHistoryCreateOrConnectWithoutCreatorInput | PaymentHistoryCreateOrConnectWithoutCreatorInput[]
    createMany?: PaymentHistoryCreateManyCreatorInputEnvelope
    connect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutCreatorInput = {
    create?: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput> | TransactionCreateWithoutCreatorInput[] | TransactionUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreatorInput | TransactionCreateOrConnectWithoutCreatorInput[]
    createMany?: TransactionCreateManyCreatorInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type QueueUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<QueueCreateWithoutCreatorInput, QueueUncheckedCreateWithoutCreatorInput> | QueueCreateWithoutCreatorInput[] | QueueUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: QueueCreateOrConnectWithoutCreatorInput | QueueCreateOrConnectWithoutCreatorInput[]
    createMany?: QueueCreateManyCreatorInputEnvelope
    connect?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
  }

  export type PaymentHistoryUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<PaymentHistoryCreateWithoutCreatorInput, PaymentHistoryUncheckedCreateWithoutCreatorInput> | PaymentHistoryCreateWithoutCreatorInput[] | PaymentHistoryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: PaymentHistoryCreateOrConnectWithoutCreatorInput | PaymentHistoryCreateOrConnectWithoutCreatorInput[]
    createMany?: PaymentHistoryCreateManyCreatorInputEnvelope
    connect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput> | TransactionCreateWithoutCreatorInput[] | TransactionUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreatorInput | TransactionCreateOrConnectWithoutCreatorInput[]
    createMany?: TransactionCreateManyCreatorInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type QueueUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<QueueCreateWithoutCreatorInput, QueueUncheckedCreateWithoutCreatorInput> | QueueCreateWithoutCreatorInput[] | QueueUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: QueueCreateOrConnectWithoutCreatorInput | QueueCreateOrConnectWithoutCreatorInput[]
    upsert?: QueueUpsertWithWhereUniqueWithoutCreatorInput | QueueUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: QueueCreateManyCreatorInputEnvelope
    set?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
    disconnect?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
    delete?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
    connect?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
    update?: QueueUpdateWithWhereUniqueWithoutCreatorInput | QueueUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: QueueUpdateManyWithWhereWithoutCreatorInput | QueueUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: QueueScalarWhereInput | QueueScalarWhereInput[]
  }

  export type PaymentHistoryUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<PaymentHistoryCreateWithoutCreatorInput, PaymentHistoryUncheckedCreateWithoutCreatorInput> | PaymentHistoryCreateWithoutCreatorInput[] | PaymentHistoryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: PaymentHistoryCreateOrConnectWithoutCreatorInput | PaymentHistoryCreateOrConnectWithoutCreatorInput[]
    upsert?: PaymentHistoryUpsertWithWhereUniqueWithoutCreatorInput | PaymentHistoryUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: PaymentHistoryCreateManyCreatorInputEnvelope
    set?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    disconnect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    delete?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    connect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    update?: PaymentHistoryUpdateWithWhereUniqueWithoutCreatorInput | PaymentHistoryUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: PaymentHistoryUpdateManyWithWhereWithoutCreatorInput | PaymentHistoryUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: PaymentHistoryScalarWhereInput | PaymentHistoryScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput> | TransactionCreateWithoutCreatorInput[] | TransactionUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreatorInput | TransactionCreateOrConnectWithoutCreatorInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCreatorInput | TransactionUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: TransactionCreateManyCreatorInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCreatorInput | TransactionUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCreatorInput | TransactionUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type QueueUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<QueueCreateWithoutCreatorInput, QueueUncheckedCreateWithoutCreatorInput> | QueueCreateWithoutCreatorInput[] | QueueUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: QueueCreateOrConnectWithoutCreatorInput | QueueCreateOrConnectWithoutCreatorInput[]
    upsert?: QueueUpsertWithWhereUniqueWithoutCreatorInput | QueueUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: QueueCreateManyCreatorInputEnvelope
    set?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
    disconnect?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
    delete?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
    connect?: QueueWhereUniqueInput | QueueWhereUniqueInput[]
    update?: QueueUpdateWithWhereUniqueWithoutCreatorInput | QueueUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: QueueUpdateManyWithWhereWithoutCreatorInput | QueueUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: QueueScalarWhereInput | QueueScalarWhereInput[]
  }

  export type PaymentHistoryUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<PaymentHistoryCreateWithoutCreatorInput, PaymentHistoryUncheckedCreateWithoutCreatorInput> | PaymentHistoryCreateWithoutCreatorInput[] | PaymentHistoryUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: PaymentHistoryCreateOrConnectWithoutCreatorInput | PaymentHistoryCreateOrConnectWithoutCreatorInput[]
    upsert?: PaymentHistoryUpsertWithWhereUniqueWithoutCreatorInput | PaymentHistoryUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: PaymentHistoryCreateManyCreatorInputEnvelope
    set?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    disconnect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    delete?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    connect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    update?: PaymentHistoryUpdateWithWhereUniqueWithoutCreatorInput | PaymentHistoryUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: PaymentHistoryUpdateManyWithWhereWithoutCreatorInput | PaymentHistoryUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: PaymentHistoryScalarWhereInput | PaymentHistoryScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput> | TransactionCreateWithoutCreatorInput[] | TransactionUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutCreatorInput | TransactionCreateOrConnectWithoutCreatorInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutCreatorInput | TransactionUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: TransactionCreateManyCreatorInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutCreatorInput | TransactionUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutCreatorInput | TransactionUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutQueuesInput = {
    create?: XOR<UserCreateWithoutQueuesInput, UserUncheckedCreateWithoutQueuesInput>
    connectOrCreate?: UserCreateOrConnectWithoutQueuesInput
    connect?: UserWhereUniqueInput
  }

  export type PaymentHistoryCreateNestedManyWithoutQueueInput = {
    create?: XOR<PaymentHistoryCreateWithoutQueueInput, PaymentHistoryUncheckedCreateWithoutQueueInput> | PaymentHistoryCreateWithoutQueueInput[] | PaymentHistoryUncheckedCreateWithoutQueueInput[]
    connectOrCreate?: PaymentHistoryCreateOrConnectWithoutQueueInput | PaymentHistoryCreateOrConnectWithoutQueueInput[]
    createMany?: PaymentHistoryCreateManyQueueInputEnvelope
    connect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
  }

  export type PaymentHistoryUncheckedCreateNestedManyWithoutQueueInput = {
    create?: XOR<PaymentHistoryCreateWithoutQueueInput, PaymentHistoryUncheckedCreateWithoutQueueInput> | PaymentHistoryCreateWithoutQueueInput[] | PaymentHistoryUncheckedCreateWithoutQueueInput[]
    connectOrCreate?: PaymentHistoryCreateOrConnectWithoutQueueInput | PaymentHistoryCreateOrConnectWithoutQueueInput[]
    createMany?: PaymentHistoryCreateManyQueueInputEnvelope
    connect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
  }

  export type UserUpdateOneWithoutQueuesNestedInput = {
    create?: XOR<UserCreateWithoutQueuesInput, UserUncheckedCreateWithoutQueuesInput>
    connectOrCreate?: UserCreateOrConnectWithoutQueuesInput
    upsert?: UserUpsertWithoutQueuesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutQueuesInput, UserUpdateWithoutQueuesInput>, UserUncheckedUpdateWithoutQueuesInput>
  }

  export type PaymentHistoryUpdateManyWithoutQueueNestedInput = {
    create?: XOR<PaymentHistoryCreateWithoutQueueInput, PaymentHistoryUncheckedCreateWithoutQueueInput> | PaymentHistoryCreateWithoutQueueInput[] | PaymentHistoryUncheckedCreateWithoutQueueInput[]
    connectOrCreate?: PaymentHistoryCreateOrConnectWithoutQueueInput | PaymentHistoryCreateOrConnectWithoutQueueInput[]
    upsert?: PaymentHistoryUpsertWithWhereUniqueWithoutQueueInput | PaymentHistoryUpsertWithWhereUniqueWithoutQueueInput[]
    createMany?: PaymentHistoryCreateManyQueueInputEnvelope
    set?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    disconnect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    delete?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    connect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    update?: PaymentHistoryUpdateWithWhereUniqueWithoutQueueInput | PaymentHistoryUpdateWithWhereUniqueWithoutQueueInput[]
    updateMany?: PaymentHistoryUpdateManyWithWhereWithoutQueueInput | PaymentHistoryUpdateManyWithWhereWithoutQueueInput[]
    deleteMany?: PaymentHistoryScalarWhereInput | PaymentHistoryScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type PaymentHistoryUncheckedUpdateManyWithoutQueueNestedInput = {
    create?: XOR<PaymentHistoryCreateWithoutQueueInput, PaymentHistoryUncheckedCreateWithoutQueueInput> | PaymentHistoryCreateWithoutQueueInput[] | PaymentHistoryUncheckedCreateWithoutQueueInput[]
    connectOrCreate?: PaymentHistoryCreateOrConnectWithoutQueueInput | PaymentHistoryCreateOrConnectWithoutQueueInput[]
    upsert?: PaymentHistoryUpsertWithWhereUniqueWithoutQueueInput | PaymentHistoryUpsertWithWhereUniqueWithoutQueueInput[]
    createMany?: PaymentHistoryCreateManyQueueInputEnvelope
    set?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    disconnect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    delete?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    connect?: PaymentHistoryWhereUniqueInput | PaymentHistoryWhereUniqueInput[]
    update?: PaymentHistoryUpdateWithWhereUniqueWithoutQueueInput | PaymentHistoryUpdateWithWhereUniqueWithoutQueueInput[]
    updateMany?: PaymentHistoryUpdateManyWithWhereWithoutQueueInput | PaymentHistoryUpdateManyWithWhereWithoutQueueInput[]
    deleteMany?: PaymentHistoryScalarWhereInput | PaymentHistoryScalarWhereInput[]
  }

  export type QueueCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<QueueCreateWithoutPaymentsInput, QueueUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: QueueCreateOrConnectWithoutPaymentsInput
    connect?: QueueWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutPaymentsInput = {
    create?: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentsInput
    connect?: UserWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type QueueUpdateOneWithoutPaymentsNestedInput = {
    create?: XOR<QueueCreateWithoutPaymentsInput, QueueUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: QueueCreateOrConnectWithoutPaymentsInput
    upsert?: QueueUpsertWithoutPaymentsInput
    disconnect?: QueueWhereInput | boolean
    delete?: QueueWhereInput | boolean
    connect?: QueueWhereUniqueInput
    update?: XOR<XOR<QueueUpdateToOneWithWhereWithoutPaymentsInput, QueueUpdateWithoutPaymentsInput>, QueueUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserUpdateOneWithoutPaymentsNestedInput = {
    create?: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutPaymentsInput
    upsert?: UserUpsertWithoutPaymentsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPaymentsInput, UserUpdateWithoutPaymentsInput>, UserUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutTransactionsNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    upsert?: UserUpsertWithoutTransactionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsInput, UserUpdateWithoutTransactionsInput>, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type ItemPriceCreateNestedManyWithoutCompanyInput = {
    create?: XOR<ItemPriceCreateWithoutCompanyInput, ItemPriceUncheckedCreateWithoutCompanyInput> | ItemPriceCreateWithoutCompanyInput[] | ItemPriceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ItemPriceCreateOrConnectWithoutCompanyInput | ItemPriceCreateOrConnectWithoutCompanyInput[]
    createMany?: ItemPriceCreateManyCompanyInputEnvelope
    connect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
  }

  export type ItemPriceUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<ItemPriceCreateWithoutCompanyInput, ItemPriceUncheckedCreateWithoutCompanyInput> | ItemPriceCreateWithoutCompanyInput[] | ItemPriceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ItemPriceCreateOrConnectWithoutCompanyInput | ItemPriceCreateOrConnectWithoutCompanyInput[]
    createMany?: ItemPriceCreateManyCompanyInputEnvelope
    connect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
  }

  export type ItemPriceUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<ItemPriceCreateWithoutCompanyInput, ItemPriceUncheckedCreateWithoutCompanyInput> | ItemPriceCreateWithoutCompanyInput[] | ItemPriceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ItemPriceCreateOrConnectWithoutCompanyInput | ItemPriceCreateOrConnectWithoutCompanyInput[]
    upsert?: ItemPriceUpsertWithWhereUniqueWithoutCompanyInput | ItemPriceUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: ItemPriceCreateManyCompanyInputEnvelope
    set?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    disconnect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    delete?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    connect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    update?: ItemPriceUpdateWithWhereUniqueWithoutCompanyInput | ItemPriceUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: ItemPriceUpdateManyWithWhereWithoutCompanyInput | ItemPriceUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: ItemPriceScalarWhereInput | ItemPriceScalarWhereInput[]
  }

  export type ItemPriceUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<ItemPriceCreateWithoutCompanyInput, ItemPriceUncheckedCreateWithoutCompanyInput> | ItemPriceCreateWithoutCompanyInput[] | ItemPriceUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ItemPriceCreateOrConnectWithoutCompanyInput | ItemPriceCreateOrConnectWithoutCompanyInput[]
    upsert?: ItemPriceUpsertWithWhereUniqueWithoutCompanyInput | ItemPriceUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: ItemPriceCreateManyCompanyInputEnvelope
    set?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    disconnect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    delete?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    connect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    update?: ItemPriceUpdateWithWhereUniqueWithoutCompanyInput | ItemPriceUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: ItemPriceUpdateManyWithWhereWithoutCompanyInput | ItemPriceUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: ItemPriceScalarWhereInput | ItemPriceScalarWhereInput[]
  }

  export type ItemPriceCreateNestedManyWithoutItemInput = {
    create?: XOR<ItemPriceCreateWithoutItemInput, ItemPriceUncheckedCreateWithoutItemInput> | ItemPriceCreateWithoutItemInput[] | ItemPriceUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemPriceCreateOrConnectWithoutItemInput | ItemPriceCreateOrConnectWithoutItemInput[]
    createMany?: ItemPriceCreateManyItemInputEnvelope
    connect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
  }

  export type ItemPriceUncheckedCreateNestedManyWithoutItemInput = {
    create?: XOR<ItemPriceCreateWithoutItemInput, ItemPriceUncheckedCreateWithoutItemInput> | ItemPriceCreateWithoutItemInput[] | ItemPriceUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemPriceCreateOrConnectWithoutItemInput | ItemPriceCreateOrConnectWithoutItemInput[]
    createMany?: ItemPriceCreateManyItemInputEnvelope
    connect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
  }

  export type ItemPriceUpdateManyWithoutItemNestedInput = {
    create?: XOR<ItemPriceCreateWithoutItemInput, ItemPriceUncheckedCreateWithoutItemInput> | ItemPriceCreateWithoutItemInput[] | ItemPriceUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemPriceCreateOrConnectWithoutItemInput | ItemPriceCreateOrConnectWithoutItemInput[]
    upsert?: ItemPriceUpsertWithWhereUniqueWithoutItemInput | ItemPriceUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: ItemPriceCreateManyItemInputEnvelope
    set?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    disconnect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    delete?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    connect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    update?: ItemPriceUpdateWithWhereUniqueWithoutItemInput | ItemPriceUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: ItemPriceUpdateManyWithWhereWithoutItemInput | ItemPriceUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: ItemPriceScalarWhereInput | ItemPriceScalarWhereInput[]
  }

  export type ItemPriceUncheckedUpdateManyWithoutItemNestedInput = {
    create?: XOR<ItemPriceCreateWithoutItemInput, ItemPriceUncheckedCreateWithoutItemInput> | ItemPriceCreateWithoutItemInput[] | ItemPriceUncheckedCreateWithoutItemInput[]
    connectOrCreate?: ItemPriceCreateOrConnectWithoutItemInput | ItemPriceCreateOrConnectWithoutItemInput[]
    upsert?: ItemPriceUpsertWithWhereUniqueWithoutItemInput | ItemPriceUpsertWithWhereUniqueWithoutItemInput[]
    createMany?: ItemPriceCreateManyItemInputEnvelope
    set?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    disconnect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    delete?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    connect?: ItemPriceWhereUniqueInput | ItemPriceWhereUniqueInput[]
    update?: ItemPriceUpdateWithWhereUniqueWithoutItemInput | ItemPriceUpdateWithWhereUniqueWithoutItemInput[]
    updateMany?: ItemPriceUpdateManyWithWhereWithoutItemInput | ItemPriceUpdateManyWithWhereWithoutItemInput[]
    deleteMany?: ItemPriceScalarWhereInput | ItemPriceScalarWhereInput[]
  }

  export type ItemMasterCreateNestedOneWithoutPricesInput = {
    create?: XOR<ItemMasterCreateWithoutPricesInput, ItemMasterUncheckedCreateWithoutPricesInput>
    connectOrCreate?: ItemMasterCreateOrConnectWithoutPricesInput
    connect?: ItemMasterWhereUniqueInput
  }

  export type CompanyCreateNestedOneWithoutItemsInput = {
    create?: XOR<CompanyCreateWithoutItemsInput, CompanyUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutItemsInput
    connect?: CompanyWhereUniqueInput
  }

  export type ItemMasterUpdateOneRequiredWithoutPricesNestedInput = {
    create?: XOR<ItemMasterCreateWithoutPricesInput, ItemMasterUncheckedCreateWithoutPricesInput>
    connectOrCreate?: ItemMasterCreateOrConnectWithoutPricesInput
    upsert?: ItemMasterUpsertWithoutPricesInput
    connect?: ItemMasterWhereUniqueInput
    update?: XOR<XOR<ItemMasterUpdateToOneWithWhereWithoutPricesInput, ItemMasterUpdateWithoutPricesInput>, ItemMasterUncheckedUpdateWithoutPricesInput>
  }

  export type CompanyUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<CompanyCreateWithoutItemsInput, CompanyUncheckedCreateWithoutItemsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutItemsInput
    upsert?: CompanyUpsertWithoutItemsInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutItemsInput, CompanyUpdateWithoutItemsInput>, CompanyUncheckedUpdateWithoutItemsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
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
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
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
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[]
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[]
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type QueueCreateWithoutCreatorInput = {
    patient_id: string
    patient_name: string
    company_code?: string | null
    company_name?: string | null
    queue_number: number
    status?: string
    priority?: number
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payments?: PaymentHistoryCreateNestedManyWithoutQueueInput
  }

  export type QueueUncheckedCreateWithoutCreatorInput = {
    id?: number
    patient_id: string
    patient_name: string
    company_code?: string | null
    company_name?: string | null
    queue_number: number
    status?: string
    priority?: number
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    payments?: PaymentHistoryUncheckedCreateNestedManyWithoutQueueInput
  }

  export type QueueCreateOrConnectWithoutCreatorInput = {
    where: QueueWhereUniqueInput
    create: XOR<QueueCreateWithoutCreatorInput, QueueUncheckedCreateWithoutCreatorInput>
  }

  export type QueueCreateManyCreatorInputEnvelope = {
    data: QueueCreateManyCreatorInput | QueueCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type PaymentHistoryCreateWithoutCreatorInput = {
    patient_id: string
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    queue?: QueueCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentHistoryUncheckedCreateWithoutCreatorInput = {
    id?: number
    patient_id: string
    queue_id?: number | null
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentHistoryCreateOrConnectWithoutCreatorInput = {
    where: PaymentHistoryWhereUniqueInput
    create: XOR<PaymentHistoryCreateWithoutCreatorInput, PaymentHistoryUncheckedCreateWithoutCreatorInput>
  }

  export type PaymentHistoryCreateManyCreatorInputEnvelope = {
    data: PaymentHistoryCreateManyCreatorInput | PaymentHistoryCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutCreatorInput = {
    transaction_no: string
    patient_id: string
    type: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    clinic_code?: string | null
    created_at?: Date | string
  }

  export type TransactionUncheckedCreateWithoutCreatorInput = {
    id?: number
    transaction_no: string
    patient_id: string
    type: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    clinic_code?: string | null
    created_at?: Date | string
  }

  export type TransactionCreateOrConnectWithoutCreatorInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput>
  }

  export type TransactionCreateManyCreatorInputEnvelope = {
    data: TransactionCreateManyCreatorInput | TransactionCreateManyCreatorInput[]
    skipDuplicates?: boolean
  }

  export type QueueUpsertWithWhereUniqueWithoutCreatorInput = {
    where: QueueWhereUniqueInput
    update: XOR<QueueUpdateWithoutCreatorInput, QueueUncheckedUpdateWithoutCreatorInput>
    create: XOR<QueueCreateWithoutCreatorInput, QueueUncheckedCreateWithoutCreatorInput>
  }

  export type QueueUpdateWithWhereUniqueWithoutCreatorInput = {
    where: QueueWhereUniqueInput
    data: XOR<QueueUpdateWithoutCreatorInput, QueueUncheckedUpdateWithoutCreatorInput>
  }

  export type QueueUpdateManyWithWhereWithoutCreatorInput = {
    where: QueueScalarWhereInput
    data: XOR<QueueUpdateManyMutationInput, QueueUncheckedUpdateManyWithoutCreatorInput>
  }

  export type QueueScalarWhereInput = {
    AND?: QueueScalarWhereInput | QueueScalarWhereInput[]
    OR?: QueueScalarWhereInput[]
    NOT?: QueueScalarWhereInput | QueueScalarWhereInput[]
    id?: IntFilter<"Queue"> | number
    patient_id?: StringFilter<"Queue"> | string
    patient_name?: StringFilter<"Queue"> | string
    company_code?: StringNullableFilter<"Queue"> | string | null
    company_name?: StringNullableFilter<"Queue"> | string | null
    queue_number?: IntFilter<"Queue"> | number
    status?: StringFilter<"Queue"> | string
    priority?: IntFilter<"Queue"> | number
    clinic_code?: StringNullableFilter<"Queue"> | string | null
    created_by?: IntNullableFilter<"Queue"> | number | null
    created_at?: DateTimeFilter<"Queue"> | Date | string
    updated_at?: DateTimeFilter<"Queue"> | Date | string
  }

  export type PaymentHistoryUpsertWithWhereUniqueWithoutCreatorInput = {
    where: PaymentHistoryWhereUniqueInput
    update: XOR<PaymentHistoryUpdateWithoutCreatorInput, PaymentHistoryUncheckedUpdateWithoutCreatorInput>
    create: XOR<PaymentHistoryCreateWithoutCreatorInput, PaymentHistoryUncheckedCreateWithoutCreatorInput>
  }

  export type PaymentHistoryUpdateWithWhereUniqueWithoutCreatorInput = {
    where: PaymentHistoryWhereUniqueInput
    data: XOR<PaymentHistoryUpdateWithoutCreatorInput, PaymentHistoryUncheckedUpdateWithoutCreatorInput>
  }

  export type PaymentHistoryUpdateManyWithWhereWithoutCreatorInput = {
    where: PaymentHistoryScalarWhereInput
    data: XOR<PaymentHistoryUpdateManyMutationInput, PaymentHistoryUncheckedUpdateManyWithoutCreatorInput>
  }

  export type PaymentHistoryScalarWhereInput = {
    AND?: PaymentHistoryScalarWhereInput | PaymentHistoryScalarWhereInput[]
    OR?: PaymentHistoryScalarWhereInput[]
    NOT?: PaymentHistoryScalarWhereInput | PaymentHistoryScalarWhereInput[]
    id?: IntFilter<"PaymentHistory"> | number
    patient_id?: StringFilter<"PaymentHistory"> | string
    queue_id?: IntNullableFilter<"PaymentHistory"> | number | null
    amount?: DecimalFilter<"PaymentHistory"> | Decimal | DecimalJsLike | number | string
    payment_method?: StringNullableFilter<"PaymentHistory"> | string | null
    status?: StringFilter<"PaymentHistory"> | string
    transaction_no?: StringNullableFilter<"PaymentHistory"> | string | null
    or_no?: StringNullableFilter<"PaymentHistory"> | string | null
    clinic_code?: StringNullableFilter<"PaymentHistory"> | string | null
    created_by?: IntNullableFilter<"PaymentHistory"> | number | null
    created_at?: DateTimeFilter<"PaymentHistory"> | Date | string
    updated_at?: DateTimeFilter<"PaymentHistory"> | Date | string
  }

  export type TransactionUpsertWithWhereUniqueWithoutCreatorInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutCreatorInput, TransactionUncheckedUpdateWithoutCreatorInput>
    create: XOR<TransactionCreateWithoutCreatorInput, TransactionUncheckedCreateWithoutCreatorInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutCreatorInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutCreatorInput, TransactionUncheckedUpdateWithoutCreatorInput>
  }

  export type TransactionUpdateManyWithWhereWithoutCreatorInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutCreatorInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: IntFilter<"Transaction"> | number
    transaction_no?: StringFilter<"Transaction"> | string
    patient_id?: StringFilter<"Transaction"> | string
    type?: StringFilter<"Transaction"> | string
    amount?: DecimalFilter<"Transaction"> | Decimal | DecimalJsLike | number | string
    description?: StringNullableFilter<"Transaction"> | string | null
    clinic_code?: StringNullableFilter<"Transaction"> | string | null
    created_by?: IntNullableFilter<"Transaction"> | number | null
    created_at?: DateTimeFilter<"Transaction"> | Date | string
  }

  export type UserCreateWithoutQueuesInput = {
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    payments?: PaymentHistoryCreateNestedManyWithoutCreatorInput
    transactions?: TransactionCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutQueuesInput = {
    id?: number
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    payments?: PaymentHistoryUncheckedCreateNestedManyWithoutCreatorInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutQueuesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutQueuesInput, UserUncheckedCreateWithoutQueuesInput>
  }

  export type PaymentHistoryCreateWithoutQueueInput = {
    patient_id: string
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    creator?: UserCreateNestedOneWithoutPaymentsInput
  }

  export type PaymentHistoryUncheckedCreateWithoutQueueInput = {
    id?: number
    patient_id: string
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentHistoryCreateOrConnectWithoutQueueInput = {
    where: PaymentHistoryWhereUniqueInput
    create: XOR<PaymentHistoryCreateWithoutQueueInput, PaymentHistoryUncheckedCreateWithoutQueueInput>
  }

  export type PaymentHistoryCreateManyQueueInputEnvelope = {
    data: PaymentHistoryCreateManyQueueInput | PaymentHistoryCreateManyQueueInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutQueuesInput = {
    update: XOR<UserUpdateWithoutQueuesInput, UserUncheckedUpdateWithoutQueuesInput>
    create: XOR<UserCreateWithoutQueuesInput, UserUncheckedCreateWithoutQueuesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutQueuesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutQueuesInput, UserUncheckedUpdateWithoutQueuesInput>
  }

  export type UserUpdateWithoutQueuesInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentHistoryUpdateManyWithoutCreatorNestedInput
    transactions?: TransactionUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutQueuesInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentHistoryUncheckedUpdateManyWithoutCreatorNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type PaymentHistoryUpsertWithWhereUniqueWithoutQueueInput = {
    where: PaymentHistoryWhereUniqueInput
    update: XOR<PaymentHistoryUpdateWithoutQueueInput, PaymentHistoryUncheckedUpdateWithoutQueueInput>
    create: XOR<PaymentHistoryCreateWithoutQueueInput, PaymentHistoryUncheckedCreateWithoutQueueInput>
  }

  export type PaymentHistoryUpdateWithWhereUniqueWithoutQueueInput = {
    where: PaymentHistoryWhereUniqueInput
    data: XOR<PaymentHistoryUpdateWithoutQueueInput, PaymentHistoryUncheckedUpdateWithoutQueueInput>
  }

  export type PaymentHistoryUpdateManyWithWhereWithoutQueueInput = {
    where: PaymentHistoryScalarWhereInput
    data: XOR<PaymentHistoryUpdateManyMutationInput, PaymentHistoryUncheckedUpdateManyWithoutQueueInput>
  }

  export type QueueCreateWithoutPaymentsInput = {
    patient_id: string
    patient_name: string
    company_code?: string | null
    company_name?: string | null
    queue_number: number
    status?: string
    priority?: number
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    creator?: UserCreateNestedOneWithoutQueuesInput
  }

  export type QueueUncheckedCreateWithoutPaymentsInput = {
    id?: number
    patient_id: string
    patient_name: string
    company_code?: string | null
    company_name?: string | null
    queue_number: number
    status?: string
    priority?: number
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type QueueCreateOrConnectWithoutPaymentsInput = {
    where: QueueWhereUniqueInput
    create: XOR<QueueCreateWithoutPaymentsInput, QueueUncheckedCreateWithoutPaymentsInput>
  }

  export type UserCreateWithoutPaymentsInput = {
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queues?: QueueCreateNestedManyWithoutCreatorInput
    transactions?: TransactionCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutPaymentsInput = {
    id?: number
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queues?: QueueUncheckedCreateNestedManyWithoutCreatorInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutPaymentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
  }

  export type QueueUpsertWithoutPaymentsInput = {
    update: XOR<QueueUpdateWithoutPaymentsInput, QueueUncheckedUpdateWithoutPaymentsInput>
    create: XOR<QueueCreateWithoutPaymentsInput, QueueUncheckedCreateWithoutPaymentsInput>
    where?: QueueWhereInput
  }

  export type QueueUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: QueueWhereInput
    data: XOR<QueueUpdateWithoutPaymentsInput, QueueUncheckedUpdateWithoutPaymentsInput>
  }

  export type QueueUpdateWithoutPaymentsInput = {
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneWithoutQueuesNestedInput
  }

  export type QueueUncheckedUpdateWithoutPaymentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutPaymentsInput = {
    update: XOR<UserUpdateWithoutPaymentsInput, UserUncheckedUpdateWithoutPaymentsInput>
    create: XOR<UserCreateWithoutPaymentsInput, UserUncheckedCreateWithoutPaymentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPaymentsInput, UserUncheckedUpdateWithoutPaymentsInput>
  }

  export type UserUpdateWithoutPaymentsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queues?: QueueUpdateManyWithoutCreatorNestedInput
    transactions?: TransactionUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutPaymentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queues?: QueueUncheckedUpdateManyWithoutCreatorNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type UserCreateWithoutTransactionsInput = {
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queues?: QueueCreateNestedManyWithoutCreatorInput
    payments?: PaymentHistoryCreateNestedManyWithoutCreatorInput
  }

  export type UserUncheckedCreateWithoutTransactionsInput = {
    id?: number
    username: string
    email?: string | null
    password: string
    first_name?: string | null
    last_name?: string | null
    department?: string | null
    role?: string | null
    activated?: number
    ldap_import?: number
    deleted_at?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queues?: QueueUncheckedCreateNestedManyWithoutCreatorInput
    payments?: PaymentHistoryUncheckedCreateNestedManyWithoutCreatorInput
  }

  export type UserCreateOrConnectWithoutTransactionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
  }

  export type UserUpsertWithoutTransactionsInput = {
    update: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserUpdateWithoutTransactionsInput = {
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queues?: QueueUpdateManyWithoutCreatorNestedInput
    payments?: PaymentHistoryUpdateManyWithoutCreatorNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    first_name?: NullableStringFieldUpdateOperationsInput | string | null
    last_name?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    role?: NullableStringFieldUpdateOperationsInput | string | null
    activated?: IntFieldUpdateOperationsInput | number
    ldap_import?: IntFieldUpdateOperationsInput | number
    deleted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queues?: QueueUncheckedUpdateManyWithoutCreatorNestedInput
    payments?: PaymentHistoryUncheckedUpdateManyWithoutCreatorNestedInput
  }

  export type ItemPriceCreateWithoutCompanyInput = {
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    item: ItemMasterCreateNestedOneWithoutPricesInput
  }

  export type ItemPriceUncheckedCreateWithoutCompanyInput = {
    id?: number
    item_code: string
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemPriceCreateOrConnectWithoutCompanyInput = {
    where: ItemPriceWhereUniqueInput
    create: XOR<ItemPriceCreateWithoutCompanyInput, ItemPriceUncheckedCreateWithoutCompanyInput>
  }

  export type ItemPriceCreateManyCompanyInputEnvelope = {
    data: ItemPriceCreateManyCompanyInput | ItemPriceCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type ItemPriceUpsertWithWhereUniqueWithoutCompanyInput = {
    where: ItemPriceWhereUniqueInput
    update: XOR<ItemPriceUpdateWithoutCompanyInput, ItemPriceUncheckedUpdateWithoutCompanyInput>
    create: XOR<ItemPriceCreateWithoutCompanyInput, ItemPriceUncheckedCreateWithoutCompanyInput>
  }

  export type ItemPriceUpdateWithWhereUniqueWithoutCompanyInput = {
    where: ItemPriceWhereUniqueInput
    data: XOR<ItemPriceUpdateWithoutCompanyInput, ItemPriceUncheckedUpdateWithoutCompanyInput>
  }

  export type ItemPriceUpdateManyWithWhereWithoutCompanyInput = {
    where: ItemPriceScalarWhereInput
    data: XOR<ItemPriceUpdateManyMutationInput, ItemPriceUncheckedUpdateManyWithoutCompanyInput>
  }

  export type ItemPriceScalarWhereInput = {
    AND?: ItemPriceScalarWhereInput | ItemPriceScalarWhereInput[]
    OR?: ItemPriceScalarWhereInput[]
    NOT?: ItemPriceScalarWhereInput | ItemPriceScalarWhereInput[]
    id?: IntFilter<"ItemPrice"> | number
    item_code?: StringFilter<"ItemPrice"> | string
    company_code?: StringFilter<"ItemPrice"> | string
    price?: DecimalFilter<"ItemPrice"> | Decimal | DecimalJsLike | number | string
    price_group?: StringNullableFilter<"ItemPrice"> | string | null
    status?: StringFilter<"ItemPrice"> | string
    created_at?: DateTimeFilter<"ItemPrice"> | Date | string
    updated_at?: DateTimeFilter<"ItemPrice"> | Date | string
  }

  export type ItemPriceCreateWithoutItemInput = {
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
    company: CompanyCreateNestedOneWithoutItemsInput
  }

  export type ItemPriceUncheckedCreateWithoutItemInput = {
    id?: number
    company_code: string
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemPriceCreateOrConnectWithoutItemInput = {
    where: ItemPriceWhereUniqueInput
    create: XOR<ItemPriceCreateWithoutItemInput, ItemPriceUncheckedCreateWithoutItemInput>
  }

  export type ItemPriceCreateManyItemInputEnvelope = {
    data: ItemPriceCreateManyItemInput | ItemPriceCreateManyItemInput[]
    skipDuplicates?: boolean
  }

  export type ItemPriceUpsertWithWhereUniqueWithoutItemInput = {
    where: ItemPriceWhereUniqueInput
    update: XOR<ItemPriceUpdateWithoutItemInput, ItemPriceUncheckedUpdateWithoutItemInput>
    create: XOR<ItemPriceCreateWithoutItemInput, ItemPriceUncheckedCreateWithoutItemInput>
  }

  export type ItemPriceUpdateWithWhereUniqueWithoutItemInput = {
    where: ItemPriceWhereUniqueInput
    data: XOR<ItemPriceUpdateWithoutItemInput, ItemPriceUncheckedUpdateWithoutItemInput>
  }

  export type ItemPriceUpdateManyWithWhereWithoutItemInput = {
    where: ItemPriceScalarWhereInput
    data: XOR<ItemPriceUpdateManyMutationInput, ItemPriceUncheckedUpdateManyWithoutItemInput>
  }

  export type ItemMasterCreateWithoutPricesInput = {
    item_code: string
    item_name: string
    category?: string | null
    department?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemMasterUncheckedCreateWithoutPricesInput = {
    id?: number
    item_code: string
    item_name: string
    category?: string | null
    department?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemMasterCreateOrConnectWithoutPricesInput = {
    where: ItemMasterWhereUniqueInput
    create: XOR<ItemMasterCreateWithoutPricesInput, ItemMasterUncheckedCreateWithoutPricesInput>
  }

  export type CompanyCreateWithoutItemsInput = {
    eros_code: string
    name: string
    address?: string | null
    contact?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CompanyUncheckedCreateWithoutItemsInput = {
    id?: number
    eros_code: string
    name: string
    address?: string | null
    contact?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type CompanyCreateOrConnectWithoutItemsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutItemsInput, CompanyUncheckedCreateWithoutItemsInput>
  }

  export type ItemMasterUpsertWithoutPricesInput = {
    update: XOR<ItemMasterUpdateWithoutPricesInput, ItemMasterUncheckedUpdateWithoutPricesInput>
    create: XOR<ItemMasterCreateWithoutPricesInput, ItemMasterUncheckedCreateWithoutPricesInput>
    where?: ItemMasterWhereInput
  }

  export type ItemMasterUpdateToOneWithWhereWithoutPricesInput = {
    where?: ItemMasterWhereInput
    data: XOR<ItemMasterUpdateWithoutPricesInput, ItemMasterUncheckedUpdateWithoutPricesInput>
  }

  export type ItemMasterUpdateWithoutPricesInput = {
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemMasterUncheckedUpdateWithoutPricesInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_code?: StringFieldUpdateOperationsInput | string
    item_name?: StringFieldUpdateOperationsInput | string
    category?: NullableStringFieldUpdateOperationsInput | string | null
    department?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUpsertWithoutItemsInput = {
    update: XOR<CompanyUpdateWithoutItemsInput, CompanyUncheckedUpdateWithoutItemsInput>
    create: XOR<CompanyCreateWithoutItemsInput, CompanyUncheckedCreateWithoutItemsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutItemsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutItemsInput, CompanyUncheckedUpdateWithoutItemsInput>
  }

  export type CompanyUpdateWithoutItemsInput = {
    eros_code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateWithoutItemsInput = {
    id?: IntFieldUpdateOperationsInput | number
    eros_code?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    contact?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type QueueCreateManyCreatorInput = {
    id?: number
    patient_id: string
    patient_name: string
    company_code?: string | null
    company_name?: string | null
    queue_number: number
    status?: string
    priority?: number
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentHistoryCreateManyCreatorInput = {
    id?: number
    patient_id: string
    queue_id?: number | null
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TransactionCreateManyCreatorInput = {
    id?: number
    transaction_no: string
    patient_id: string
    type: string
    amount: Decimal | DecimalJsLike | number | string
    description?: string | null
    clinic_code?: string | null
    created_at?: Date | string
  }

  export type QueueUpdateWithoutCreatorInput = {
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentHistoryUpdateManyWithoutQueueNestedInput
  }

  export type QueueUncheckedUpdateWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    payments?: PaymentHistoryUncheckedUpdateManyWithoutQueueNestedInput
  }

  export type QueueUncheckedUpdateManyWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    patient_name?: StringFieldUpdateOperationsInput | string
    company_code?: NullableStringFieldUpdateOperationsInput | string | null
    company_name?: NullableStringFieldUpdateOperationsInput | string | null
    queue_number?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    priority?: IntFieldUpdateOperationsInput | number
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentHistoryUpdateWithoutCreatorInput = {
    patient_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queue?: QueueUpdateOneWithoutPaymentsNestedInput
  }

  export type PaymentHistoryUncheckedUpdateWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    queue_id?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentHistoryUncheckedUpdateManyWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    queue_id?: NullableIntFieldUpdateOperationsInput | number | null
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUpdateWithoutCreatorInput = {
    transaction_no?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    transaction_no?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransactionUncheckedUpdateManyWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    transaction_no?: StringFieldUpdateOperationsInput | string
    patient_id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentHistoryCreateManyQueueInput = {
    id?: number
    patient_id: string
    amount: Decimal | DecimalJsLike | number | string
    payment_method?: string | null
    status?: string
    transaction_no?: string | null
    or_no?: string | null
    clinic_code?: string | null
    created_by?: number | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type PaymentHistoryUpdateWithoutQueueInput = {
    patient_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneWithoutPaymentsNestedInput
  }

  export type PaymentHistoryUncheckedUpdateWithoutQueueInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentHistoryUncheckedUpdateManyWithoutQueueInput = {
    id?: IntFieldUpdateOperationsInput | number
    patient_id?: StringFieldUpdateOperationsInput | string
    amount?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    payment_method?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    transaction_no?: NullableStringFieldUpdateOperationsInput | string | null
    or_no?: NullableStringFieldUpdateOperationsInput | string | null
    clinic_code?: NullableStringFieldUpdateOperationsInput | string | null
    created_by?: NullableIntFieldUpdateOperationsInput | number | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPriceCreateManyCompanyInput = {
    id?: number
    item_code: string
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemPriceUpdateWithoutCompanyInput = {
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    item?: ItemMasterUpdateOneRequiredWithoutPricesNestedInput
  }

  export type ItemPriceUncheckedUpdateWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_code?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPriceUncheckedUpdateManyWithoutCompanyInput = {
    id?: IntFieldUpdateOperationsInput | number
    item_code?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPriceCreateManyItemInput = {
    id?: number
    company_code: string
    price: Decimal | DecimalJsLike | number | string
    price_group?: string | null
    status?: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ItemPriceUpdateWithoutItemInput = {
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutItemsNestedInput
  }

  export type ItemPriceUncheckedUpdateWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    company_code?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ItemPriceUncheckedUpdateManyWithoutItemInput = {
    id?: IntFieldUpdateOperationsInput | number
    company_code?: StringFieldUpdateOperationsInput | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price_group?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
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