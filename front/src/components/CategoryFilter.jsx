import { useEffect, useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';

function CategoryFilter({ onSelectionChange }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // expecting [{ id, name }]
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const isSelected = (category) =>
    selected.some((c) => c.id === category.id);

  const toggleCategory = (category) => {
    const alreadySelected = isSelected(category);

    const newSelected = alreadySelected
      ? selected.filter((c) => c.id !== category.id)
      : [...selected, category];

    setSelected(newSelected);

    if (onSelectionChange) {
      // Notify parent component with just IDs
      onSelectionChange(newSelected.map((c) => c.id));
    }
  };

  const removeCategory = (category) => {
    const newSelected = selected.filter((c) => c.id !== category.id);
    setSelected(newSelected);
    if (onSelectionChange) {
      onSelectionChange(newSelected.map((c) => c.id));
    }
  };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-categories">
          {loading ? 'Загрузка...' : 'Категория'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {loading && (
            <Dropdown.Item disabled>
              <Spinner animation="border" size="sm" className="me-2" />
              Loading...
            </Dropdown.Item>
          )}
          {error && <Dropdown.Item disabled>{error}</Dropdown.Item>}
          {!loading &&
            !error &&
            categories.map((category) => (
              <Dropdown.Item
                key={category.id}
                onClick={() => toggleCategory(category)}
                active={isSelected(category)}
              >
                {category.categoryName}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>

      {selected.length > 0 && (
        <Stack direction="horizontal" gap={2} className="mt-3 flex-wrap">
          {selected.map((category) => (
            <Badge
              key={category.id}
              bg="info"
              className="d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => removeCategory(category)}
            >
              {category.categoryName}
              <span className="ms-2">&times;</span>
            </Badge>
          ))}
        </Stack>
      )}
    </div>
  );
}

export default CategoryFilter;
