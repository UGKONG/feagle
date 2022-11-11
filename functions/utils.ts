import axios from "axios";
import { createConnection } from "mysql";
import { hangulIncludes, josa } from "@toss/hangul";
import { isEmail, isMobilePhone, isRRN } from "@toss/validators";
import {
  formatBusinessRegistrationNumber,
  ceilToUnit,
  commaizeNumber,
  chunk,
  delay,
  floorToUnit,
  getOSByUserAgent,
  isServer,
  isNonEmptyArray,
  isIE,
  formatToKRW,
  uniqBy,
  sum,
  QS,
  smoothScrollTo,
  roundToUnit,
  retryRequestsOf,
  range,
  shuffle,
  formatPhoneNumber,
  Masker,
  mapValues,
  generateID,
  maskName,
  clamp,
  minBy,
  loadScript,
  last,
  arrayIncludes,
  maxBy,
  sample,
} from "@toss/utils";

export type JosaWord =
  | "이/가"
  | "을/를"
  | "은/는"
  | "으로/로"
  | "와/과"
  | "이나/나"
  | "이에/에";
export type PlatformReturn = "node" | "ios" | "android" | "web" | "other";
export type ScrollOption = { speed: number } | { duration: number };
export interface SuccessResponseData {
  now: string;
  result: boolean;
  current: any;
  message: "success";
}
export interface FailResponseData {
  now: string;
  result: boolean;
  current: null;
  message: string;
}
export interface AxiosResponse {
  data: SuccessResponseData | FailResponseData;
}
export interface ConnectionConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  dateStrings: boolean;
  multipleStatements: boolean;
}
export interface ConnectionReturn {
  error: Error | null;
  result: any;
  sql: string;
}
export interface dateTimeFormat {
  date: "-" | "/" | ".";
  time: ":" | "." | "/";
}

/**
 * @example
 * fail('에러입니다.');
 * @return
 * result: false,
 * message: "에러입니다."
 * current: null
 */
export const fail = (message: string = "Error"): FailResponseData => {
  console.log(message);
  return {
    now: useDate(),
    result: false,
    message: message,
    current: null,
  };
};

/**
 * @example
 * success('성공입니다.');
 * @return
 * result: true
 * message: "success"
 * current: "성공입니다."
 */
export const success = (data: any = null): SuccessResponseData => {
  return {
    now: useDate(),
    result: true,
    message: "success",
    current: data,
  };
};

export const useAxios = axios.create({
  baseURL: process.env.API_URL || "/api",
  timeout: 5000,
});

/**
 * @example
 * useBirthValidate('980127');
 * // true
 * useBirthValidate('asdf');
 * // false
 * useBirthValidate('25.4');
 * // false
 */
export const useBirthValidate = (input: string): boolean => {
  return isEmail(input);
};

/**
 *
 * @example
 * useBusinessNumber('0000000000');
 * // '000-00-00000'
 */
export const useBusinessNumber = (number: string): string => {
  let result: string = formatBusinessRegistrationNumber(number);

  return result;
};

/**
 * @example
 * useCeil(16232, 3);
 * // 17000
 * useCeil(548642482, 8);
 * // 600000000
 * useCeil(123456, 4);
 * // 130,000
 */
export const useCeil = (
  number: number,
  zeroCount: number,
  isComma?: boolean
): number | string => {
  let result: number = ceilToUnit(number, Math.pow(10, zeroCount));
  if (!isComma) return result;
  return commaizeNumber(result);
};

/**
 * @example
 * useChunkArray([1, 2, 3, 4], 1);
 * // [[1], [2], [3], [4]]
 * useChunkArray([1, 2, 3, 4, 5, 6], 3);
 * // [[1, 2, 3], [4, 5, 6]]
 * useChunkArray([1, 2, 3, 4, 5, 6, 7], 2);
 * // [[1, 2], [3, 4], [5, 6], [7]]
 * useChunkArray([], 2);
 * // []
 */
export const useChunkArray = (array: Array<any>, count: number): Array<any> => {
  return chunk(array, count);
};

/**
 * @example
 * const { error, result, sql } = await useDatabase(`
 *   SELECT * FROM 테이블명
 *   WHERE USER_ID = ? AND USER_PW = ?;
 * `, ['USER_ID', 'USER_PW']);
 */
export const useDatabase = (
  sql: string,
  sqlParams?: Array<string | number>
): Promise<ConnectionReturn> => {
  const config: ConnectionConfig = {
    host: process.env.DB_HOST ?? "",
    user: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_DATABASE ?? "",
    dateStrings: true,
    multipleStatements: true,
  };
  const db = createConnection(config);

  return new Promise((success) => {
    db.query(sql, sqlParams, (error: Error | null, result: any) => {
      db.end();
      if (error) console.log(error);
      success({ error, result, sql });
    });
  });
};

/**
 * @example
 * useDate(new Date());
 * // 2022-10-16 14:30:10
 * useDate(new Date(), false);
 * // 2022-10-16
 * useDate(new Date(), true, { date: '.', time: '/'});
 * // 2022.10.16 14/30/10
 */
export const useDate = (
  date: Date = new Date(),
  isFull: boolean = true,
  format: dateTimeFormat = { date: "-", time: ":" }
): string => {
  let Y: string = String(date.getFullYear());
  let M: string = String(date.getMonth() + 1);
  M = M?.length < 2 ? "0" + M : M;
  let D: string = String(date.getDate());
  D = D?.length < 2 ? "0" + D : D;
  let dateString: string = `${Y}${format.date}${M}${format.date}${D}`;

  if (isFull) {
    let h: string = String(date.getHours());
    h = h?.length < 2 ? "0" + h : h;
    let m: string = String(date.getMinutes());
    m = m?.length < 2 ? "0" + m : m;
    let s: string = String(date.getSeconds());
    s = s?.length < 2 ? "0" + s : s;
    let timeString: string = `${h}${format.time}${m}${format.time}${s}`;

    return dateString + " " + timeString;
  }

  return dateString;
};

/**
 * @example
 * useDelay(3);
 * // 3초 뒤 실행
 */
export const useDelay = async (
  s: number,
  callback?: () => void
): Promise<void> => {
  await delay(s * 1000);
  if (callback) callback();
};

/**
 * @example
 * useEmailValidate('sanguk@sanguk.kr');
 * // true
 * useEmailValidate('asdf');
 * // false
 */
export const useEmailValidate = (input: string): boolean => {
  return isEmail(input);
};

/**
 * @example
 * useFloor(16232, 3);
 * // 16000
 * useFloor(548642482, 8);
 * // 500000000
 * useFloor(123456, 4);
 * // 120,000
 */
export const useFloor = (
  number: number,
  zeroCount: number,
  isComma?: boolean
): number | string => {
  let result: number = floorToUnit(number, Math.pow(10, zeroCount));

  if (!isComma) return result;

  return commaizeNumber(result);
};

/**
 * @returns node | ios | android | web | other
 */
export const useGetOs = (): PlatformReturn => {
  let agent = getOSByUserAgent();
  let result: PlatformReturn = agent ? agent : isServer() ? "node" : "other";
  return result;
};

/**
 * @example
 * useHangulJosa('샴푸', '이/가');
 * // 샴푸가
 * useHangulJosa('칫솔', '이/가');
 * // 칫솔이
 * useHangulJosa('바깥', '으로/로');
 * // 바깥으로
 */
export const useHangulJosa = (word: string, josaWord: JosaWord): string => {
  return josa(word, josaWord);
};

/**
 * @example
 * useIsEmptyArray([1, 2, 3]);
 * // false
 * useIsEmptyArray([]);
 * // true
 */
export const useIsEmptyArray = (array: Array<any>): boolean => {
  let result: boolean = isNonEmptyArray(array);
  return !result;
};

export const useIsIE = (): boolean => {
  let result = isIE();
  return result;
};

/**
 * @example
 * useIsInArray([1, 2, 3], 3);
 * // true
 * useIsInArray([1, 2, 3], 5);
 * // false
 */
export const useIsInArray = (
  array: Array<number | string>,
  item: number | string
): boolean => {
  let result: boolean = arrayIncludes(array, item);
  return result;
};

/**
 * @example
 * useLastItem<number>([1, 2, 3]);
 * // 3
 * useLastItem<{id:number}>([{id: 1}, {id: 2}, {id: 3}]);
 * // {id: 3}
 * useLastItem([]);
 * // undefined
 */
export const useLastItem = <T = any>(array: Array<T>): T => {
  let result: any = last(array);
  return result;
};

/**
 * @example
 * useLoadScript('https://example.com/script.js');
 */
export const useLoadScript = async (source: string): Promise<void> => {
  await loadScript(source);
};

/**
 * @example
 * useMax([1, 2, 3, 4]);
 * // 4
 * useMax([{id: 1}, {id: 2}, {id: 3}], 'id');
 * // {id: 3}
 * useMax([{name: '가'}, {name: '나'}, {name: '다'}], 'name');
 * // {name: '다'}
 */
export const useMax = (array: Array<any>, property?: string): any => {
  let type = typeof array[0];
  if (type === "undefined") return undefined;
  if (type === "string" || type === "number") {
    return maxBy(array, (x) => x);
  }
  if (property) return maxBy(array, (item) => item[property]);
  return undefined;
};

/**
 * @example
 * useMin([1, 2, 3, 4]);
 * // 1
 * useMin([{id: 1}, {id: 2}, {id: 3}], 'id');
 * // {id: 1}
 * useMin([{name: '가'}, {name: '나'}, {name: '다'}], 'name');
 * // {name: '가'}
 */
export const useMin = (array: Array<any>, property?: string): any => {
  let type = typeof array[0];
  if (type === "undefined") return undefined;

  if (type === "string" || type === "number") {
    return minBy(array, (x) => x);
  }

  if (property) return minBy(array, (item) => item[property]);

  return undefined;
};

/**
 * @description
 * useMinMax (값, 최소값, 최대값);
 * @example
 * useMinMax(3, 1);
 * // 3
 * useMinMax(3, 1, 5);
 * // 3
 * useMinMax(3, 5);
 * // 5
 * useMinMax(7, 3, 5);
 * // 5
 */
export const useMinMax = (
  number: number,
  min: number,
  max?: number
): number => {
  let result: any = clamp(number, min, max ?? min);

  return result;
};

/**
 * @example
 * useNameMask('전상욱');
 * // 전*욱
 */
export const useNameMask = (name: string, maskChar?: string): string => {
  return maskName(name, { maskChar: maskChar || "*" });
};

/**
 * @example
 * useNewId();
 * // 1
 * useNewId();
 * // 2
 * useNewId();
 * // 3
 */
export const useNewId = (): number => {
  return Number(generateID());
};

/**
 * @example
 * useNoop
 */
export const useNoop = (): void => {};

/**
 * @example
 * useObjectKeys({id: 1, name: '전상욱'});
 * // ['id', 'name']
 */
export const useObjectKeys = (object: any): Array<string> => {
  return Object.keys(object);
};

/**
 * @example
 * useObjectMap({ foo: 1, bar: 2 }, x => x * 2);
 * // { foo: 2, bar: 4 }
 */
export const useObjectMap = (object: any, callback: (x: any) => any): any => {
  return mapValues(object, callback);
};

/**
 * @example
 * useObjectValues({id: 1, name: '전상욱'});
 * // [1, '전상욱']
 */
export const useObjectValues = (object: any): Array<string> => {
  return Object.values(object);
};

/**
 * @param number1 loaded value
 * @param number2 all value
 * @example
 * usePercent(3, 10)
 * @return
 * 30
 */
export const usePercent = (number1?: number, number2?: number): number => {
  if (!number1) return 0;
  if (!number2) return 0;
  let result: number = (number1 / number2) * 100;
  return result;
};

/**
 * @example
 * usePhoneMask('010-1234-5678');
 * // 010-****-5678
 * usePhoneMask('01012345678');
 * // 010****5678
 */
export const usePhoneMask = (phoneNumber: string): string => {
  return Masker.maskPhoneNumber(phoneNumber);
};

/**
 * @example
 * usePhoneNumber('01025560000');
 * // '010-2556-0000'
 * usePhoneNumber('0215994905');
 * // '02-1599-4905'
 */
export const usePhoneNumber = (phoneNumber: string): string => {
  let result: string = formatPhoneNumber(phoneNumber);

  return result;
};

/**
 * @example
 * usePhoneValidate('01012341234');
 * // true
 * usePhoneValidate('010-1234-1234');
 * // true
 * usePhoneValidate('010123412');
 * // false
 * usePhoneValidate('asdf');
 * // false
 */
export const usePhoneValidate = (input: string): boolean => {
  return isMobilePhone(input);
};

/**
 * @example
 * useQueryString({id: 1, name: '전상욱'});
 * // ?id=1&name=전상욱
 * useQueryString({id: 1, language: ['js', 'ts']});
 * // ?id=1&language=js&language=ts
 */
export const useQueryString = (object: any): string => {
  return QS.create(object);
};

/**
 * @example
 * useRandomArray([1, 2, 3, 4]);
 * // [4, 3, 1, 2]
 */
export const useRandomArray = (array: Array<any>): Array<any> => {
  return shuffle(array);
};

/**
 * @example
 * useRandomChoiceArray([1, 2, 3]);
 * // 3
 * useRandomChoiceArray([1, 2, 3]);
 * // 2
 * useRandomChoiceArray({ id: 1 }, { id: 2 }, { id: 3 });
 * // { id: 2 }
 * useRandomChoiceArray([]);
 * // undefined
 */
export const useRandomChoiceArray = (array: Array<any>): any => {
  let result: any = sample(array);

  return result;
};

/**
 * @example
 * useRange(1, 5);
 * // [1, 2, 3, 4]
 * useRange(4);
 * // [0, 1, 2, 3]
 * useRange(1, 11, 3);
 * // [1, 4, 7, 10]
 */
export const useRange = (
  start: number,
  end?: number,
  step?: number
): Array<number> => {
  return range(start, end, step);
};

/**
 * @example
 * useRetry(() => {
 *   console.log('called');
 *   throw new Error('Failed');
 * }, 2, () => {
 *   console.log('Error!!')
 * });
 * // called
 * // Error!!
 * // called
 * // Error!!
 */
export const useRetry = (
  callback: any,
  retryCount?: number,
  errorCallback?: () => void
): any => {
  let result = retryRequestsOf(callback, {
    retries: retryCount ?? 0,
    onError: errorCallback ?? (() => {}),
  });
  result();
  return result;
};

/**
 * @example
 * useRound(16232, 3);
 * // 16000
 * useRound(548642482, 8);
 * // 500000000
 * useRound(123456, 4);
 * // 120,000
 */
export const useRound = (
  number: number,
  zeroCount: number,
  isComma?: boolean
): number | string => {
  let result: number = roundToUnit(number, Math.pow(10, zeroCount));

  if (!isComma) return result;

  return commaizeNumber(result);
};

export const useScrollTo = (
  element: Element | Window,
  to: number,
  option?: ScrollOption
): void => {
  smoothScrollTo(element ?? window, { top: to ?? 0 }, option);
};

/**
 * @example
 * useSearchHangul('개발자', '갭');
 * // true
 * useSearchHangul('개발자', '개발ㅈ');
 * // true
 * useSearchHangul('개발자', '개밪');
 * // false
 */
export const useSearchHangul = (
  current: string,
  searchText?: string
): boolean => {
  return hangulIncludes(current, searchText ?? "");
};

/**
 * @example
 * useStringQuery('id=1&name=전상욱');
 * // {id: 1, name: '전상욱'}
 * useStringQuery('?id=1&name=전상욱');
 * // {id: 1, name: '전상욱'}
 * useStringQuery('?id=1&language=js&language=ts');
 * // {id: 1, language: ['js', 'ts']}
 */
export const useStringQuery = (object: string): object => {
  return QS.parse(object);
};

/**
 * @example
 * useSum([1, 2, 3, 4]);
 * // 10
 */
export const useSum = (numberArray: Array<number>): number => {
  return sum(numberArray);
};

/**
 * @example
 * useUniqArray([1, 2, 3, 4]);
 * // 4
 * useUniqArray([{id: 1}, {id: 2}, {id: 3}], 'id');
 * // {id: 3}
 * useUniqArray([{name: '가'}, {name: '나'}, {name: '다'}], 'name');
 * // {name: '다'}
 */
export const useUniqArray = (
  array: Array<any>,
  property?: string
): Array<any> => {
  let type = typeof array[0];
  if (type === "undefined") return [];

  if (type === "string" || type === "number") {
    return uniqBy(array, (x) => x);
  }

  if (property) return uniqBy(array, (x) => x[property]);

  return [];
};

/**
 * @example
 * useUserSq('9801271234567');
 * // true
 * useUserSq('9801271234');
 * // false
 * useUserSq('asgsd');
 * // false
 */
export const useUserSq = (input: string): boolean => {
  return isRRN(input);
};

/**
 * @example
 * useWon(5685);
 * // 5,685원
 * useWon(13209802);
 * // 1,320만 9,802원
 */
export const useWon = (number: number): string => {
  let result: string = formatToKRW(number);

  return result;
};
