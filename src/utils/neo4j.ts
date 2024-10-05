import {
  DateTime,
  Duration,
  Integer,
  LocalDateTime,
  Date as Neo4jDate,
  Point,
  int as neo4jInt,
} from 'neo4j-driver';

export module Neo4jUtils {
  /**
   * @param node - node of any type
   *
   * @descriptions Takes in a node of any type, if the node is of any type that is returned from the neo4j database
   * value of that node is translated into native JavaScript value. If node is an object with fields all those fields are
   * translated into JavaScript values recursively.
   *
   */
  function translate(node: any) {
    if (
      node instanceof DateTime ||
      node instanceof LocalDateTime ||
      node instanceof Neo4jDate
    ) {
      return node.toStandardDate();
    }
    if (node instanceof Integer) {
      if (node.inSafeRange()) {
        return node.toNumber();
      }
      return node.toString();
    }
    if (node instanceof Point) {
      return { x: node.x, y: node.y, z: node.z, srid: node.srid };
    }
    if (node instanceof Duration) {
      return node.toString();
    }
    if (typeof node === 'object' && node !== null) {
      const simplifiedObject: any = {};
      for (const key in node) {
        simplifiedObject[key] = translate(node[key]);
      }
      return simplifiedObject;
    }
    return node;
  }

  /**
   * @param response - from the neo4j database that is an array response
   *
   * @description Takes a response from the database and translates array of
   * neo4j database specific data structures into native JavaScript values like Dates, numbers,
   * strings or booleans.
   *
   */
  export function simplifyArrayResponse<T = any>(response: any[]): T[] {
    if (!Array.isArray(response)) {
      throw new Error('Response is not an array');
    }

    return response.map((r) =>
      r.properties ? translate(r.properties) : undefined
    );
  }

  /**
   * @param response - from the neo4j database that is a singular item
   *
   * @description Takes a response from the database and returns full objects or simple value
   * converting all neo4j specific data structures to native JavaScript values like Dates, strings, numbers or booleans.
   *
   */
  export function simplifyResponse<T = any>(
    response: any | any[]
  ): T | undefined {
    if (response === null) {
      return undefined;
    }

    if (!response.properties) return translate(response);

    return translate(response.properties);
  }

  /**
   *
   * @param response - either array or item response from neo4j database query
   *
   * @description Takes response from the neo4j database and depending on the
   * type and returns result from simplifyArrayResponse for arrays
   * and simplifyResponse for single items
   *
   */
  export function simplifyAnyResponse(response: any | any[]): any | undefined {
    return Array.isArray(response)
      ? simplifyArrayResponse(response)
      : simplifyResponse(response);
  }

  export function pagination(page: number, limit: number) {
    return {
      skip: neo4jInt((page - 1) * limit),
      limit: neo4jInt(limit),
    };
  }
}
