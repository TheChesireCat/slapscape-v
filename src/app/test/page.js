import Test from '@/app/components/Test';
import ModalTest from '../components/ModalTest';
import TemporaryDrawer from '../components/TemporaryDrawer';


export default function TestComponent() {
  return (
      <div>
        <ModalTest />
        <TemporaryDrawer />
        <div>Hello</div>
      </div>
  );
}