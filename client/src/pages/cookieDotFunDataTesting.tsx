import React, { useState } from 'react';
import {
  getCookieFunAgentsPaged,
  getCookieFunAgentByTwitter,
  getCookieFunAgentByContract
} from '../api/agentsAPI';
import JsonView from '@microlink/react-json-view';

const CookieDotFunDataTesting: React.FC = () => {
  const [twitterUsername, setTwitterUsername] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [page, setPage] = useState('1');
  const [pageSize, setPageSize] = useState('5');
  const [interval, setInterval] = useState('_7Days');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetPaged = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCookieFunAgentsPaged({
        page: Number(page),
        pageSize: Number(pageSize),
        interval
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGetByTwitter = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCookieFunAgentByTwitter(twitterUsername, interval);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGetByContract = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCookieFunAgentByContract(contractAddress, interval);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-slate-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Cookie.fun API Testing</h1>

      {/* Common Settings */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg">
        <h2 className="text-xl mb-4">Common Settings</h2>
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="bg-slate-700 p-2 rounded mr-4 mb-2"
        >
          <option value="_3Days">3 Days</option>
          <option value="_7Days">7 Days</option>
        </select>
      </div>

      {/* Paged Agents Section */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg">
        <h2 className="text-xl mb-4">Get Paged Agents</h2>
        <div className="flex flex-col gap-2">
          <div>
            <label htmlFor="page" className="block text-sm text-gray-300 mb-1">
              Page Number (which page of results to fetch)
            </label>
            <input
              id="page"
              type="number"
              value={page}
              onChange={(e) => setPage(e.target.value)}
              placeholder="Page"
              className="bg-slate-700 p-2 rounded mr-4 mb-2"
            />
          </div>
          <div>
            <label htmlFor="pageSize" className="block text-sm text-gray-300 mb-1">
              Page Size (number of results per page)
            </label>
            <input
              id="pageSize"
              type="number"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              placeholder="Page Size"
              className="bg-slate-700 p-2 rounded mr-4 mb-2"
            />
          </div>
        </div>
        <button
          onClick={handleGetPaged}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Get Paged Agents
        </button>
      </div>

      {/* Twitter Section */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg">
        <h2 className="text-xl mb-4">Get Agent by Twitter</h2>
        <input
          type="text"
          value={twitterUsername}
          onChange={(e) => setTwitterUsername(e.target.value)}
          placeholder="Twitter Username"
          className="bg-slate-700 p-2 rounded mr-4 mb-2"
        />
        <button
          onClick={handleGetByTwitter}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Get by Twitter
        </button>
      </div>

      {/* Contract Section */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg">
        <h2 className="text-xl mb-4">Get Agent by Contract</h2>
        <input
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Contract Address"
          className="bg-slate-700 p-2 rounded mr-4 mb-2"
        />
        <button
          onClick={handleGetByContract}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Get by Contract
        </button>
      </div>

      {/* Results Section */}
      <div className="mt-8">
        {loading && <div className="text-blue-400">Loading...</div>}
        {error && <div className="text-red-400">Error: {error}</div>}
        {result && (
          <div className="bg-slate-800 p-4 rounded-lg">
            <h3 className="text-xl mb-4">Result:</h3>
            <div className="bg-slate-700 p-4 rounded-lg overflow-auto max-h-[600px]">
              <JsonView
                src={result}
                theme={{
                  base00: 'transparent',
                  base01: '#334155',
                  base02: '#475569',
                  base03: '#64748b',
                  base04: '#94a3b8',
                  base05: '#e2e8f0',
                  base06: '#f1f5f9',
                  base07: '#ffffff',
                  base08: '#ef4444',
                  base09: '#f97316',
                  base0A: '#eab308',
                  base0B: '#22c55e',
                  base0C: '#06b6d4',
                  base0D: '#3b82f6',
                  base0E: '#a855f7',
                  base0F: '#ec4899',
                }}
                style={{ backgroundColor: 'transparent' }}
                displayDataTypes={false}
                name={null}
                collapseStringsAfterLength={15}
                displayObjectSize={false}
                indentWidth={2}
                collapsed={2}
                enableClipboard={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieDotFunDataTesting;
