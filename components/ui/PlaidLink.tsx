import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './button'
import { PlaidLinkOnSuccess, PlaidLinkOptions, usePlaidLink } from 'react-plaid-link'
import { useRouter } from 'next/navigation';
import { createLinkToken } from '@/lib/actions/user.actions';

const PlaidLink = ( {user, variant}: PlaidLinkProps) => {
    const router = useRouter();

    const [token, setToken] = useState('');
    
    useEffect(()=> {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);

            setToken(data?.linkToken);
        }
    },[user]);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        // await exchangePublicToken({
        //     public_token: public_token,
        //     user,
        // })
        router.push('/');
    }, [user])

    const config: PlaidLinkOptions = {
        token,
        onSuccess
    }

    const {open, ready } = usePlaidLink(config);

  return (
    <>
      {variant === 'primary' ? (
        <Button 
            className='plaidlink-primary'
            onClick={()=> open()}
            disabled={!ready}>
            Connect bank
        </Button>
      ): variant === 'ghost' ? (
        <Button>
            Connect bank
        </Button>
      ): (
        <Button>
             Connect bank
        </Button>
      )}
    </>
  )
}

export default PlaidLink
