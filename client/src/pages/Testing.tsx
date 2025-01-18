import { generateRandomAgent } from '../utils/generateRandomAgent';

export default function Testing() {

    const handleButtonClick = () => {
        const randomAgent = generateRandomAgent();
        console.log(randomAgent); // You can replace this with any action you want to perform with the random agent
    };

    return (
        <div>
            <h1 className="text-2xl font-bold" style={{ color: 'white' }}>Testing</h1>
            <button className="text-2xl font-bold" style={{ color: 'white' }} onClick={handleButtonClick}>Generate Random Agent</button>
        </div>
    )
}