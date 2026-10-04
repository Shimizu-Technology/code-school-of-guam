import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { RefinedTimelineSection } from '../components/refined-timeline-section'

afterEach(cleanup)

test('timeline disclosures preserve heading navigation and keep descriptions outside buttons', () => {
  render(<RefinedTimelineSection timelineItems={[{ weeks: 'Week 1', title: 'Fundamentals', description: 'Practice the basics.' }]} />)
  expect(screen.getAllByRole('heading', { level: 3, name: 'Fundamentals' })).toHaveLength(2)
  const controls = screen.getAllByRole('button', { name: 'Fundamentals' })
  for (const control of controls) {
    expect(control.getAttribute('aria-expanded')).toBe('false')
    expect(control.textContent).not.toContain('Practice the basics.')
  }
  fireEvent.click(controls[0])
  expect(controls[0].getAttribute('aria-expanded')).toBe('true')
  expect(screen.getByText('Hands-on project work')).toBeTruthy()
  fireEvent.click(controls[0])
  expect(controls[0].getAttribute('aria-expanded')).toBe('false')
  expect(screen.queryByText('Hands-on project work')).toBeNull()
})
