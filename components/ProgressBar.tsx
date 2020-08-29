import { FC, CSSProperties } from 'react'
import { LinearProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  colorPrimary: {
    backgroundColor: '#ffffff',
  },
  bar1Determinate: {
    backgroundColor: '#198c19',
  }
})

interface ProgressBarProps {
  style: CSSProperties,
  value: number
}

export const ProgressBar: FC<ProgressBarProps> = (
  props: ProgressBarProps
) => {
  const classes = useStyles()

  return (
    <LinearProgress
      classes={{
        colorPrimary: classes.colorPrimary,
        bar1Determinate: classes.bar1Determinate
      }}
      style={props.style}
      variant="determinate"
      value={props.value}
    />
  )
}
