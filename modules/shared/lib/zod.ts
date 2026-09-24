import { ZodType } from "zod";

export class ValidationError extends Error {

  field: string;
  status: number;

  constructor(
    props: {
     message: string,
     field: string,
     status?: number
    }
  ) {
    super(props.message);
    this.status = props.status ?? 400;
    this.field = props.field;
  }
}

export const zodValidator = async <T extends ZodType>( body: unknown, schema: T ) => {

  const resp = await schema.safeParseAsync(body);

  if(!resp.success){
    const error = resp.error.issues[0];
    throw new ValidationError({
      message: error.message,
      field: error.path.join("."),
    });
  }

  return resp.data;

}