import Site from '@/components/Site';
import { organizationLd, faqLd } from '@/lib/seo';

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd()) }} />
      <Site />
    </>
  );
}
