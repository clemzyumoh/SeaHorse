


import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import { toast } from "react-hot-toast";

export const sendDirectPayment = async ({
  connection,
  wallet,
  recipient,
  amount,
  token,
  reference,
  memo,
}: {
  connection: Connection;
  wallet: any;
  recipient: string;
  amount: number;
  token: "SOL" | "USDC";
  reference?: string;
  memo?: string;
}) => {
  if (!wallet.publicKey) throw new Error("Wallet not connected");
  const sender = wallet.publicKey;
  const recipientPubkey = new PublicKey(recipient.trim());

  const transaction = new Transaction();

  if (token === "SOL") {
    const lamports = amount * LAMPORTS_PER_SOL;

    const transferIx = SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: recipientPubkey,
      lamports,
    });

    if (reference) {
      transferIx.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      });
    }

    transaction.add(transferIx);

    if (memo) {
      transaction.add(
        new TransactionInstruction({
          keys: [],
          programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
          data: Buffer.from(memo),
        })
      );
    }
  } else if (token === "USDC") {
    const USDC_MINT = new PublicKey("EGcvNycAx1dkZUjm5GBgK5bj2sMNEK3cUhVwKLAXnyU9");
    const amountInSmallestUnit = amount * 10 ** 6;

    const senderTokenAccount = await getAssociatedTokenAddress(USDC_MINT, sender);
    const recipientTokenAccount = await getAssociatedTokenAddress(USDC_MINT, recipientPubkey);

    const recipientInfo = await connection.getAccountInfo(recipientTokenAccount);

    transaction.add(ComputeBudgetProgram.setComputeUnitLimit({ units: 200_000 }));

    if (!recipientInfo) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          sender,
          recipientTokenAccount,
          recipientPubkey,
          USDC_MINT
        )
      );
    }

    const transferIx = createTransferInstruction(
      senderTokenAccount,
      recipientTokenAccount,
      sender,
      amountInSmallestUnit
    );

    if (reference) {
      transferIx.keys.push({
        pubkey: new PublicKey(reference),
        isSigner: false,
        isWritable: false,
      });
    }

    transaction.add(transferIx);

    if (memo) {
      transaction.add(
        new TransactionInstruction({
          keys: [],
          programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
          data: Buffer.from(memo),
        })
      );
    }
    }
    
    try {
      
  const signature = await wallet.sendTransaction(transaction, connection);
  await connection.confirmTransaction(signature, "confirmed");
        console.log("signature", signature);
  return signature;
        
      toast.success("Payment successful!"); // ✅ Add this
    } catch (error) {
      toast.error("Payment failed!");
    }



};
