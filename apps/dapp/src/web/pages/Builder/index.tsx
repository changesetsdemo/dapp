import { Button } from '@changesetsdemo/ui';
import { CommonWrapper } from '@components/wrapper/CommonWrapper';

export default function Builder() {
  return (
    <CommonWrapper>
      <div>Solv Builder</div>
      <Button className="border rounded-[8px] p-[0.4rem] mt-[1rem]">
        @changesetsdemo/ui/button
      </Button>
    </CommonWrapper>
  );
}
