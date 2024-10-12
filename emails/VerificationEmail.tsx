import {
  Html,
  Head,
  Preview,
  Heading,
  Row,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail = function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head></Head>
      <Preview>Here&apos;s your verification code {otp}</Preview>
      <section>
        <Row>
          <Heading as="h2">Hello {username}</Heading>
        </Row>
        <Row>
          <Text>
            Thankyou for signing up. Please use the following verification code
            to verify your account.
          </Text>
        </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Row>
          <Text>If you did not sign up, please ignore this email.</Text>
        </Row>
      </section>
    </Html>
  );
}

export default VerificationEmail;
