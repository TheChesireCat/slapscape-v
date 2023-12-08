import Charts from "@/app/components/Charts";
import TemporaryDrawer from "@/app/components/TemporaryDrawer";
import { getPostsPerTag } from "@/app/lib/actions";
export default async function VisualizationsPage(){
    const result = await getPostsPerTag();
    // console.log(result);

    return <div><TemporaryDrawer/><Charts pieData={result}/></div>
}