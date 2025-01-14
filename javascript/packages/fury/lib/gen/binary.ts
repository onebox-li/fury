/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { TypeDescription } from "../description";
import { CodecBuilder } from "./builder";
import { BaseSerializerGenerator } from "./serializer";
import { CodegenRegistry } from "./router";
import { InternalSerializerType } from "../type";
import { Scope } from "./scope";

class BinarySerializerGenerator extends BaseSerializerGenerator {
  description: TypeDescription;

  constructor(description: TypeDescription, builder: CodecBuilder, scope: Scope) {
    super(description, builder, scope);
    this.description = description;
  }

  writeStmt(accessor: string): string {
    return `
        ${this.builder.writer.uint8(1)}
        ${this.builder.writer.uint32(`${accessor}.byteLength`)}
        ${this.builder.writer.buffer(accessor)}
        `;
  }

  readStmt(accessor: (expr: string) => string): string {
    const result = this.scope.uniqueName("result");
    return `
        ${this.builder.reader.uint8()}
        ${result} = ${this.builder.reader.buffer(this.builder.reader.int32())};
        ${this.pushReadRefStmt(result)};
        ${accessor(result)}
        `;
  }
}

CodegenRegistry.register(InternalSerializerType.BINARY, BinarySerializerGenerator);
