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

  export function simplifyArrayResponse<T = any>(response: any[]): T[] {
    if (!Array.isArray(response)) {
      throw new Error('Response is not an array');
    }

    return response.map((r) =>
      r.properties ? translate(r.properties) : undefined
    );
  }

  export function simplifyResponse<T = any>(
    response: any | any[]
  ): T | undefined {
    if (response === null) {
      return undefined;
    }

    if (!response.properties) return translate(response);

    return translate(response.properties);
  }

  export function pagination(page: number, limit: number) {
    return {
      skip: neo4jInt((page - 1) * limit),
      limit: neo4jInt(limit),
    };
  }
}
