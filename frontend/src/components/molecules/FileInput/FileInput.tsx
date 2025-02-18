import React, {
  ChangeEventHandler,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import Label from '../../atoms/inputs/Label';
import { DocumentToUpload } from './index';

// NB: please keep this limit in sync with the limit in nginx datapass-backend configuration
const FILE_SIZE_LIMIT_IN_MB = 10;

type Props = {
  id: string;
  label: string;
  documentType: string;
  disabled: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  mimeTypes: string;
  meta?: string;
  documentsToUpload: DocumentToUpload[];
};

export const FileInput: FunctionComponent<Props> = ({
  id,
  label,
  documentType,
  disabled,
  onChange,
  mimeTypes,
  meta,
  documentsToUpload,
}) => {
  const [documentsTooLargeError, setDocumentsTooLargeError] = useState(false);

  const areDocumentsTooLarge = (documentsToUpload: DocumentToUpload[]) => {
    // @ts-ignore
    const documentsSizeInMB = documentsToUpload.reduce(
      // @ts-ignore
      (accumulator: number, { attachment: { size } = {} }: DocumentToUpload) =>
        accumulator + size / 1024 / 1024, // in MB
      0
    );

    return documentsSizeInMB >= FILE_SIZE_LIMIT_IN_MB;
  };

  useEffect(() => {
    setDocumentsTooLargeError(areDocumentsTooLarge(documentsToUpload));
  }, [documentsToUpload]);

  return (
    <>
      <Label
        id={id}
        label={label}
        meta={`Taille maximale : ${FILE_SIZE_LIMIT_IN_MB} Mo. Formats supportés : ${
          mimeTypes === '*' ? 'tous' : mimeTypes
        }.${meta ? ' ' + meta : ''}`}
      />
      <input
        className="fr-upload"
        type="file"
        accept={mimeTypes}
        onChange={onChange}
        disabled={disabled}
        name={documentType}
        id={id}
      />
      {documentsTooLargeError && (
        <p className="fr-error-text">
          La taille des pièces jointes dépasse la taille maximale autorisée (
          {FILE_SIZE_LIMIT_IN_MB} Mo)
        </p>
      )}
    </>
  );
};

export default FileInput;
