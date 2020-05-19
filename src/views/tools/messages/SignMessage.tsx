import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Copy } from 'react-feather';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useAccountState } from 'src/context/AccountContext';
import { useSignMessageLazyQuery } from 'src/graphql/queries/__generated__/signMessage.generated';
import { Input } from '../../../components/input/Input';
import { SecureButton } from '../../../components/buttons/secureButton/SecureButton';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { Column, WrapRequest } from '../Tools.styled';
import { NoWrap } from './Messages';

export const SignMessage = () => {
  const [message, setMessage] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);
  const [signed, setSigned] = useState<string>('');

  const { auth } = useAccountState();

  const [signMessage, { data, loading }] = useSignMessageLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.signMessage) {
      setSigned(data.signMessage);
    }
  }, [loading, data]);

  const renderInput = () => (
    <>
      <SingleLine>
        <NoWrap>
          <DarkSubTitle>Message: </DarkSubTitle>
        </NoWrap>
        <Input
          withMargin={'8px 0 0'}
          onChange={e => setMessage(e.target.value)}
        />
      </SingleLine>
      <SecureButton
        callback={signMessage}
        variables={{ auth, message }}
        fullWidth={true}
        withMargin={'8px 0 4px'}
        disabled={message === ''}
        loading={loading}
      >
        Sign
      </SecureButton>
      <Separation />
    </>
  );

  const renderMessage = () => (
    <Column>
      <WrapRequest>{signed}</WrapRequest>
      <CopyToClipboard
        text={signed}
        onCopy={() => toast.success('Signature Copied')}
      >
        <ColorButton>
          <Copy size={18} />
          Copy
        </ColorButton>
      </CopyToClipboard>
    </Column>
  );

  return (
    <AdminSwitch>
      <SingleLine>
        <DarkSubTitle>Sign Message</DarkSubTitle>
        <ColorButton
          withMargin={'4px 0'}
          disabled={loading}
          arrow={!isPasting}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? <X size={18} /> : 'Sign'}
        </ColorButton>
      </SingleLine>
      {isPasting && renderInput()}
      {signed !== '' && isPasting && renderMessage()}
    </AdminSwitch>
  );
};
