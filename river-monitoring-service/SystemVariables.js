export class SystemVariables{
	States = {
		normal: "normal",
		too_low: "too-low",
		pre_too_high: "pre-too-high",
		too_high: "too-high",
		too_high_criticial: "too-high-critical"
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
		this.waterLevel = 100
		this.waterLevelRange = [50, 200, 300, 400]
	  }
}
