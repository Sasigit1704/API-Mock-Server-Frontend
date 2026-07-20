function Table({
  headers,
  children,
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">

      <table className="w-full border-collapse">

        <thead className="bg-slate-50 uppercase tracking-wide">

          <tr>

            {headers.map((header) => (

              <th
                key={header}
                className="px-8 py-5 text-left text-sm font-semibold uppercase tracking-wide text-slate-600"
              >
                {header}
              </th>

            ))}

          </tr>

        </thead>

        <tbody className="divide-y divide-slate-100">

          {children}

        </tbody>

      </table>

    </div>
  );
}

export default Table;