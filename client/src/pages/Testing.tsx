import { generateRandomAgent } from '../utils/generateRandomAgent';

export default function Testing() {

    const handleButtonClick = async () => {
        const randomAgent = await generateRandomAgent();
        console.log("randomAgent1: Testing async function. This should not show until the agent is generated.", randomAgent)

        // const randomAgent2 = await generateRandomAgent();
        // console.log("randomAgent2: Testing async function. This should not show until the agent is generated.", randomAgent2)

    };

    return (
        <div>
            <h1 className="text-2xl font-bold" style={{ color: 'white' }}>Testing</h1>
            <button className="text-2xl font-bold" style={{ color: 'white' }} onClick={handleButtonClick}>Generate Random Agent</button>
        </div>
    )
}