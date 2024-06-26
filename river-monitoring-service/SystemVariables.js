export class SystemVariables{
	States = {
		normal: "normal",
		too_low: "too-low",
		pre_too_high: "pre-too-high",
		too_high: "too-high",
		too_high_criticial: "too-high-critical",
		overwrite: "overwrite"
	}

	MonitoringFrequencies = {
		alarmMonitoringFrequency: 500,
		normalMonitoringFrequency: 1000
	}

	constructor(valveOpeningLevel) {
		this.valveOpeningLevel = valveOpeningLevel;


		this.monitoringFrequencyMs = 1000 
		this.state = this.States.normal

		//placeholder values
		this.waterLevel = null
		this.waterLevelRange = [50, 200, 300, 400]
	  }
}
