// Simple test suite for A2 assignment
describe('Math Operations', () => {
    test('addition works correctly', () => {
        expect(2 + 2).toBe(4);
    });

    test('subtraction works correctly', () => {
        expect(5 - 3).toBe(2);
    });
});

describe('String Operations', () => {
    test('string contains expected text', () => {
        expect('Hello Jenkins Pipeline').toContain('Jenkins');
    });

    test('string length is correct', () => {
        expect('A2 Assignment').toHaveLength(13);
    });
});