interface PaginationControlsProps {
  page: number;
  limit: number;
  totalPages: number;
  onChangePage: (newPage: number) => void;
  onChangeLimit: (newLimit: number) => void;
}

const PaginationControls = ({
  limit,
  page,
  totalPages,
  onChangeLimit,
  onChangePage,
}: PaginationControlsProps): JSX.Element => (
  <>
    <label htmlFor="pageSelector">Select page: </label>
    <select
      name="pageSelector"
      value={page}
      onChange={e => onChangePage(Number(e.target.value))}
    >
      {Array.from({ length: totalPages }, (_, i) => (
        <option key={i} value={i + 1}>
          {i + 1} / {totalPages}
        </option>
      ))}
    </select>

    <label htmlFor="_limit">Posts per page: </label>
    <input
      name="_limit"
      type="number"
      value={limit}
      onChange={e => onChangeLimit(Number(e.target.value) || limit)}
    />
  </>
);

export default PaginationControls;
