import MainLayout from "../mainlayout";
import { IAnnotator } from "../model/model";


const Annotator = (props: IAnnotator) => {
  return <div>  <MainLayout images={props.images}/></div>;
};

export default Annotator;
